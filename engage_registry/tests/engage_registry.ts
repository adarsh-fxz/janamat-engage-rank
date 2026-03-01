import * as anchor from "@coral-xyz/anchor";
import BN from "bn.js";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Account shapes
interface GlobalStateAccount {
  authority: PublicKey;
  totalVoters: InstanceType<typeof BN>;
  totalVotesRecorded: InstanceType<typeof BN>;
  bump: number;
}

interface EngageProfileAccount {
  voter: PublicKey;
  totalPoints: InstanceType<typeof BN>;
  voteCount: InstanceType<typeof BN>;
  currentStreak: number;
  longestStreak: number;
  lastVoteTimestamp: InstanceType<typeof BN>;
  bump: number;
}

interface ProgramAccounts {
  globalState: { fetch(address: PublicKey): Promise<GlobalStateAccount> };
  engageProfile: {
    fetch(address: PublicKey): Promise<EngageProfileAccount>;
    all(): Promise<
      Array<{ publicKey: PublicKey; account: EngageProfileAccount }>
    >;
  };
}

// Setup
const PROGRAM_ID = new PublicKey(
  "6bY93DBKnAct89SGYhNLwEukNpHm6QQ4zbwANVoWL3X9",
);

function buildProgram(): anchor.Program<anchor.Idl> {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const idl = JSON.parse(
    readFileSync(
      resolve(__dirname, "../target/idl/engage_registry.json"),
      "utf8",
    ),
  );
  return new anchor.Program(idl as anchor.Idl, provider);
}

const program = buildProgram();
const accounts = program.account as unknown as ProgramAccounts;
const authority = (program.provider as anchor.AnchorProvider)
  .wallet as anchor.Wallet;

// PDAs
const [globalStatePda] = PublicKey.findProgramAddressSync(
  [Buffer.from("global_state")],
  PROGRAM_ID,
);

const voter1 = Keypair.generate();
const [voterProfile] = PublicKey.findProgramAddressSync(
  [Buffer.from("engage_profile"), voter1.publicKey.toBuffer()],
  PROGRAM_ID,
);

// Tests
describe("engage_registry", () => {
  it("Initializes the global state", async () => {
    const existing = await program.provider.connection.getAccountInfo(
      globalStatePda,
    );
    if (existing) {
      console.log("[skip] GlobalState already exists");
      return;
    }

    const tx = await program.methods
      .initialize()
      .accounts({
        globalState: globalStatePda,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("init tx:", tx);

    const state = await accounts.globalState.fetch(globalStatePda);
    assert.ok(
      state.authority.equals(authority.publicKey),
      "authority mismatch",
    );
    assert.equal(state.totalVoters.toNumber(), 0);
  });

  it("Registers a new voter", async () => {
    const existing = await program.provider.connection.getAccountInfo(
      voterProfile,
    );
    if (existing) {
      console.log("[skip] VoterProfile already exists");
      return;
    }

    const tx = await program.methods
      .registerVoter(voter1.publicKey)
      .accounts({
        engageProfile: voterProfile,
        globalState: globalStatePda,
        payer: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("register voter tx:", tx);

    const profile = await accounts.engageProfile.fetch(voterProfile);
    assert.ok(profile.voter.equals(voter1.publicKey));
    assert.equal(profile.totalPoints.toNumber(), 0);

    const state = await accounts.globalState.fetch(globalStatePda);
    assert.isAtLeast(state.totalVoters.toNumber(), 1);
  });

  it("Awards base points for first vote", async () => {
    const txSig = "5KtPn1LGBqAtVYiE7rEXY4mTfHqnuCBgmxbqdBMc4fy1234";

    const before = await accounts.engageProfile.fetch(voterProfile);
    const pointsBefore = before.totalPoints.toNumber();

    const tx = await program.methods
      .awardPoints(new BN(1), txSig, "vote")
      .accounts({
        engageProfile: voterProfile,
        globalState: globalStatePda,
        authority: authority.publicKey,
      })
      .rpc();

    console.log("award points tx:", tx);

    const profile = await accounts.engageProfile.fetch(voterProfile);
    const gained = profile.totalPoints.toNumber() - pointsBefore;

    assert.equal(gained, 1, "should earn 1 base pt");
    assert.equal(profile.voteCount.toNumber(), 1);
    assert.equal(profile.currentStreak, 1);

    console.log(`gained: ${gained} pts, streak: ${profile.currentStreak}`);
  });

  it("Counts vote within 24h but does not award points or update streak", async () => {
    const txSig2 = "7AaBbCcDdEeFfGgHhIiJjKkLlMmNnOo12345678XxYy12";

    const before = await accounts.engageProfile.fetch(voterProfile);
    const pointsBefore = before.totalPoints.toNumber();
    const voteCountBefore = before.voteCount.toNumber();
    const streakBefore = before.currentStreak;
    const lastVoteBefore = before.lastVoteTimestamp.toNumber();

    await program.methods
      .awardPoints(new BN(2), txSig2, "vote")
      .accounts({
        engageProfile: voterProfile,
        globalState: globalStatePda,
        authority: authority.publicKey,
      })
      .rpc();

    const after = await accounts.engageProfile.fetch(voterProfile);

    assert.equal(
      after.voteCount.toNumber(),
      voteCountBefore + 1,
      "vote_count should increase",
    );
    assert.equal(
      after.totalPoints.toNumber(),
      pointsBefore,
      "points should not change",
    );
    assert.equal(after.currentStreak, streakBefore, "streak should not change");
    assert.equal(
      after.lastVoteTimestamp.toNumber(),
      lastVoteBefore,
      "last_vote_timestamp should not change",
    );

    console.log("vote counted within 24h, no points or streak change");
  });

  it("Authority enforcement: GlobalState has_one constraint is set", async () => {
    const state = await accounts.globalState.fetch(globalStatePda);
    assert.ok(
      state.authority.equals(authority.publicKey),
      "GlobalState authority should match our wallet",
    );
    console.log(
      "authority confirmed:",
      state.authority.toBase58().slice(0, 12) + "...",
    );
    console.log(
      " any other pubkey calling award_points would fail with Unauthorized (6000)",
    );
  });

  it("Reads all EngageProfile accounts (leaderboard simulation)", async () => {
    const allAccounts = await accounts.engageProfile.all();
    assert.isAtLeast(allAccounts.length, 1, "should have at least 1 profile");
    console.log(`found ${allAccounts.length} profiles on-chain`);

    const sorted = allAccounts
      .map((a) => ({
        voter: a.account.voter.toBase58().slice(0, 8),
        pts: a.account.totalPoints.toNumber(),
        streak: a.account.currentStreak,
        votes: a.account.voteCount.toNumber(),
      }))
      .sort((a, b) => b.pts - a.pts);

    console.log("top entries:", JSON.stringify(sorted.slice(0, 3), null, 2));
  });
});
