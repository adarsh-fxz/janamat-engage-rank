const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ── Leaderboard (sourced from on-chain EngageProfile accounts) ───────────────
export interface LeaderboardEntry {
  voter: string;
  points: number;
  voteCount: number;
  currentStreak: number;
  longestStreak: number;
  lastVoteTimestamp: number;
}

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE}/leaderboard?limit=${limit}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

// ── Global stats (sourced from on-chain GlobalState PDA) ─────────────────────
export interface GlobalStats {
  totalVoters: number;
  totalVotesRecorded: number;
  authority: string;
}

export async function fetchGlobalStats(): Promise<GlobalStats | null> {
  try {
    const res = await fetch(`${API_BASE}/stats`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Individual voter profile ──────────────────────────────────────────────────
export async function fetchVoterProfile(
  address: string
): Promise<LeaderboardEntry | null> {
  try {
    const res = await fetch(`${API_BASE}/profile/${address}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatPoints(points: number): string {
  if (points >= 1_000_000) return `${(points / 1_000_000).toFixed(1)}M`;
  if (points >= 1_000) return `${(points / 1_000).toFixed(1)}K`;
  return points.toString();
}

export function streakLabel(streak: number): string {
  if (streak >= 30) return "🔥 Legend";
  if (streak >= 14) return "⚡ On Fire";
  if (streak >= 7) return "✨ Hot";
  if (streak >= 3) return "🌱 Building";
  if (streak >= 1) return "👋 Started";
  return "";
}
