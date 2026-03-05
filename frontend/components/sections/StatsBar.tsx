import { fetchGlobalStats, fetchLeaderboard } from "@/lib/api";

export async function StatsBar() {
  let totalVoters = 0;
  let totalVotes = 0;

  try {
    const [stats, data] = await Promise.all([
      fetchGlobalStats(),
      fetchLeaderboard(),
    ]);
    totalVoters = stats?.totalVoters ?? data.length;
    totalVotes =
      stats?.totalVotesRecorded ?? data.reduce((s, d) => s + d.voteCount, 0);
  } catch {
    /* silently fail */
  }

  const ticker = [
    `// ${totalVoters} Registered Voters`,
    `// ${totalVotes} Votes On-Chain`,
    "// Powered by Solana",
    "// Streak Bonuses Active",
    "// Points Tracked On-Chain",
    "// Janamat Engage",
    `// ${totalVoters} Registered Voters`,
    `// ${totalVotes} Votes On-Chain`,
    "// Powered by Solana",
    "// Streak Bonuses Active",
    "// Points Tracked On-Chain",
    "// Janamat Engage",
  ];

  return (
    <div className="w-full bg-[#EAB308] border-y-[3px] border-black overflow-hidden py-3">
      <div className="whitespace-nowrap flex gap-12 animate-marquee font-display font-bold text-lg uppercase text-black">
        {ticker.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
