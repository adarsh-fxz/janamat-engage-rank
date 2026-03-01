// Read-only on-chain queries: leaderboard, global stats, voter profile.

import { PublicKey } from "@solana/web3.js";
import { getProgram, globalStatePda, engageProfilePda } from "./program.js";

export interface OnChainEntry {
  voter: string;
  points: number;
  voteCount: number;
  currentStreak: number;
  longestStreak: number;
  lastVoteTimestamp: number;
}

// Fetches all EngageProfile accounts, maps them, and returns top N by points.
export async function getOnChainLeaderboard(limit = 20): Promise<OnChainEntry[]> {
  const { program } = getProgram();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accounts = await (program.account as any).engageProfile.all();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries: OnChainEntry[] = accounts.map((a: any) => ({
    voter: a.account.voter.toBase58(),
    points: a.account.totalPoints.toNumber(),
    voteCount: a.account.voteCount.toNumber(),
    currentStreak: a.account.currentStreak,
    longestStreak: a.account.longestStreak,
    lastVoteTimestamp: a.account.lastVoteTimestamp.toNumber(),
  }));

  return entries.sort((a, b) => b.points - a.points).slice(0, limit);
}

// Fetches the GlobalState PDA — total voters, total votes, authority.
export async function getGlobalStats(): Promise<{
  totalVoters: number;
  totalVotesRecorded: number;
  authority: string;
} | null> {
  try {
    const { program } = getProgram();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = await (program.account as any).globalState.fetch(globalStatePda());
    return {
      totalVoters: state.totalVoters.toNumber(),
      totalVotesRecorded: state.totalVotesRecorded.toNumber(),
      authority: state.authority.toBase58(),
    };
  } catch {
    return null;
  }
}

// Fetches a single voter's EngageProfile. Returns null if not registered yet.
export async function getVoterProfile(voterAddress: string): Promise<OnChainEntry | null> {
  try {
    const { program } = getProgram();
    const profilePda = engageProfilePda(new PublicKey(voterAddress));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = await (program.account as any).engageProfile.fetch(profilePda);
    return {
      voter: voterAddress,
      points: p.totalPoints.toNumber(),
      voteCount: p.voteCount.toNumber(),
      currentStreak: p.currentStreak,
      longestStreak: p.longestStreak,
      lastVoteTimestamp: p.lastVoteTimestamp.toNumber(),
    };
  } catch {
    return null;
  }
}
