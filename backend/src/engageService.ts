// Write operations: register voter, award points, initialize GlobalState.

import { PublicKey, SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import {
  getProgram,
  globalStatePda,
  engageProfilePda,
  withVoterLock,
  withRetry,
} from "./program.js";
import { maybeAwardReferral } from "./referralService.js";

// Registers the voter on-chain if no EngageProfile exists yet.
async function ensureProfileExists(voterPubkey: PublicKey): Promise<void> {
  const { connection } = getProgram();
  const profilePda = engageProfilePda(voterPubkey);
  if (await connection.getAccountInfo(profilePda)) return;

  console.log(`[engage] registering new voter: ${voterPubkey.toBase58()}`);
  await withRetry(async () => {
    const { program: p, authority: a } = getProgram();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (p as any).methods
      .registerVoter(voterPubkey)
      .accounts({
        engageProfile: profilePda,
        globalState: globalStatePda(),
        payer: a.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc({ skipPreflight: true, commitment: "confirmed" });
  });

  // Brief wait for account to be visible on-chain before awarding.
  await new Promise((r) => setTimeout(r, 2000));
}

// Awards points for a vote. Registers the voter first if needed.
// Per-voter lock ensures no concurrent calls for the same address.
export async function awardEngagePoints(
  voterAddress: string,
  pollIdx: number,
  txSignature: string,
  category: string = "vote",
): Promise<boolean> {
  return withVoterLock(voterAddress, async () => {
    try {
      const voterPubkey = new PublicKey(voterAddress);

      const { connection } = getProgram();
      const isFirstVote = !(await connection.getAccountInfo(engageProfilePda(voterPubkey)));

      await ensureProfileExists(voterPubkey);

      const tx = await withRetry(async () => {
        const { program: p, authority: a } = getProgram();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (p as any).methods
          .awardPoints(new BN(pollIdx), txSignature.slice(0, 88), category.slice(0, 32))
          .accounts({
            engageProfile: engageProfilePda(voterPubkey),
            globalState: globalStatePda(),
            authority: a.publicKey,
          })
          .rpc({ skipPreflight: true, commitment: "confirmed" });
      });

      console.log(`[engage] points awarded voter=${voterAddress} poll=${pollIdx} tx=${tx}`);

      // Fire referral check only on first ever vote.
      if (isFirstVote) {
        maybeAwardReferral(voterAddress).catch((e) =>
          console.error("[referral] maybeAwardReferral failed:", e),
        );
      }

      return true;
    } catch (err) {
      console.error("[engage] awardEngagePoints failed:", err);
      return false;
    }
  });
}

// Initializes the GlobalState PDA if it doesn't exist yet (runs once on startup).
export async function initializeIfNeeded(): Promise<void> {
  const { program, authority, connection } = getProgram();
  const statePda = globalStatePda();

  if (await connection.getAccountInfo(statePda)) {
    console.log("[engage] GlobalState already initialized");
    return;
  }

  console.log("[engage] Initializing GlobalState on-chain...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (program as any).methods
    .initialize()
    .accounts({
      globalState: statePda,
      authority: authority.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  console.log("[engage] GlobalState initialized!");
}
