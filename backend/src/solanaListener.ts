// Listens to on-chain logs from vote_program and triggers point awarding on VoteCasted events.

import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { awardEngagePoints } from "./engageService.js";
import { readFileSync } from "fs";

const PROGRAM_ID = new PublicKey("4Aqd8QVYvb6xmAzYSFEBnmcD1jJnGTJ86JqK5EWG2KXB");
const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const connection = new Connection(RPC_URL, "confirmed");
const idl = JSON.parse(readFileSync("./idl.json", "utf8"));
const coder = new anchor.BorshCoder(idl);

const processedSigs = new Set<string>();

export function startSolanaListener() {
  console.log("[listener] Starting Solana log listener for vote_program...");

  const listenerId = connection.onLogs(PROGRAM_ID, async (logInfo) => {
    const { signature, logs } = logInfo;

    if (processedSigs.has(signature)) return;
    processedSigs.add(signature);

    for (const log of logs) {
      if (!log.startsWith("Program data:")) continue;

      try {
        const base64Data = log.replace("Program data: ", "");
        const event = coder.events.decode(base64Data);

        if (event?.name !== "VoteCasted") continue;

        const voter = (event.data.voter as { toBase58(): string }).toBase58();
        const pollIdx = Number(event.data.poll_idx);

        const voteData = event.data.vote_data as {
          SingleChoice?: { index: number };
          YesNo?: { choice: boolean };
          Ranked?: { ranking: Uint8Array };
          MultipleChoice?: { indices: Uint8Array };
        };

        let category = "vote";
        if (voteData.YesNo !== undefined) category = "yesno";
        else if (voteData.Ranked !== undefined) category = "ranked";
        else if (voteData.MultipleChoice !== undefined) category = "multi";

        console.log(
          `[listener] VoteCasted voter=${voter} poll=${pollIdx} sig=${signature.slice(0, 16)}...`
        );

        await awardEngagePoints(voter, pollIdx, signature, category);
      } catch (err) {
        console.error("[listener] Failed to decode/process event:", err);
      }
    }
  });

  process.on("SIGINT", async () => {
    console.log("[listener] Closing Solana log listener...");
    await connection.removeOnLogsListener(listenerId);
    process.exit(0);
  });
}
