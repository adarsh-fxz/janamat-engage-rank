import Link from "next/link";
import { fetchLeaderboard, type LeaderboardEntry } from "@/lib/api";
import { truncateAddress, formatPoints, streakLabel } from "@/lib/api";

const rankLabel = ["#1", "#2", "#3", "#4", "#5"];
const rankBg = [
  "bg-[#EA580C] text-white",
  "bg-[#EAB308] text-black",
  "bg-[#0891B2] text-white",
  "bg-white text-black",
  "bg-white text-black",
];

function formatLastVoted(lastVoteTimestamp: number): string {
  if (!lastVoteTimestamp) return "No votes yet";

  const nowMs = Date.now();
  const voteMs = lastVoteTimestamp * 1000;
  const diffSeconds = Math.max(0, Math.floor((nowMs - voteMs) / 1000));

  if (diffSeconds < 60) return "Just now";

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export async function LeaderboardPreview() {
  let entries: LeaderboardEntry[] = [];
  try {
    entries = await fetchLeaderboard();
  } catch {
    /* show empty */
  }

  const sortedByRecent = [...entries].sort(
    (a, b) => b.lastVoteTimestamp - a.lastVoteTimestamp
  );
  const top5 = sortedByRecent.slice(0, 5);
  const maxPoints = top5[0]?.points || 1;

  return (
    <section className="py-24 px-4 bg-[#FFFBEB] border-t-[3px] border-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <div className="inline-block bg-[#EA580C] border-2 border-black px-3 py-1 shadow-neo-sm rotate-1 mb-6">
            <span className="font-display font-bold text-xs uppercase tracking-widest text-white">
              Live Rankings
            </span>
          </div>
          <h2 className="font-display font-extrabold text-5xl md:text-6xl uppercase leading-tight text-black mb-6">
            See Who&apos;s
            <br />
            <span className="bg-[#EAB308] px-2 border-2 border-black inline-block -rotate-1 shadow-neo-sm">
              #1
            </span>{" "}
            Right Now.
          </h2>
          <p className="text-lg font-medium max-w-sm text-black/70 mb-8 border-l-4 border-black pl-4">
            Points tracked on-chain by the{" "}
            <code className="font-mono bg-[#EAB308] border border-black px-1">
              engage_registry
            </code>{" "}
            program. Streaks, vote counts, and rankings fully verifiable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/leaderboard"
              className="bg-[#EA580C] text-white font-display font-extrabold text-base px-8 py-4 border-[3px] border-black shadow-neo neo-btn uppercase inline-block text-center"
            >
              Full Leaderboard →
            </Link>
            <a
              href="https://janamat.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black font-display font-extrabold text-base px-8 py-4 border-[3px] border-black shadow-neo neo-btn uppercase inline-block text-center"
            >
              Join the Race
            </a>
          </div>
        </div>

        {/* Right: leaderboard card */}
        <div className="border-[3px] border-black shadow-neo-lg bg-white overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b-[3px] border-black px-5 py-3 bg-[#111]">
            <span className="font-display font-extrabold text-sm uppercase text-white tracking-wider">
              Top Voters
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#EA580C] pulse-dot" />
              <span className="font-display font-bold text-xs text-white uppercase">
                Live
              </span>
            </div>
          </div>

          {/* Rows */}
          {top5.length === 0 ? (
            <div className="py-16 text-center font-display font-bold uppercase text-black/40">
              No votes yet be the first!
            </div>
          ) : (
            <div>
              {top5.map((entry, i) => {
                const pct = Math.round((entry.points / maxPoints) * 100);
                const sl = streakLabel(entry.currentStreak);
                const lastVoted = formatLastVoted(entry.lastVoteTimestamp);
                return (
                  <div
                    key={entry.voter}
                    className={`flex items-center gap-4 px-5 py-4 border-b-2 border-black last:border-0 ${i === 0 ? "bg-[#FEF9EE]" : ""}`}
                  >
                    {/* Rank badge */}
                    <div
                      className={`w-10 h-10 shrink-0 ${rankBg[i]} border-2 border-black flex items-center justify-center font-display font-extrabold text-sm shadow-neo-sm`}
                    >
                      {rankLabel[i]}
                    </div>

                    {/* Wallet + bar */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <p className="font-mono font-bold text-sm text-black truncate">
                          {truncateAddress(entry.voter, 6)}
                        </p>
                        {sl && (
                          <span className="font-display font-bold text-xs bg-[#FEF9EE] border border-black px-1 text-black/70 shrink-0">
                            {sl}
                          </span>
                        )}
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-gray-100 border border-black h-3 p-px">
                        <div
                          className="bg-[#EA580C] h-full border-r border-black"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-0.5 font-display text-[11px] text-black/50">
                        Last vote · {lastVoted}
                      </div>
                    </div>

                    {/* Points */}
                    <div className="shrink-0 text-right">
                      <span className="font-display font-extrabold text-lg text-black">
                        {formatPoints(entry.points)}
                      </span>
                      <span className="font-display text-xs text-black/50 ml-1">
                        PTS
                      </span>
                      <div className="font-mono text-xs text-black/40">
                        {entry.voteCount}v
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {entries.length > 5 && (
            <div className="border-t-2 border-black px-5 py-3 bg-[#FEF9EE]">
              <Link
                href="/leaderboard"
                className="font-display font-bold text-xs uppercase text-black hover:text-[#EA580C] transition-colors"
              >
                +{entries.length - 5} more voters · See all →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
