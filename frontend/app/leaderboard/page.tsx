import {
  fetchLeaderboard,
  fetchGlobalStats,
  RATE_LIMIT_MESSAGE,
  type LeaderboardEntry,
} from "@/lib/api";
import { truncateAddress, formatPoints, streakLabel } from "@/lib/api";
import Link from "next/link";
import { ReferralWidget } from "@/components/sections/ReferralWidget";
import { CopyAddress } from "@/components/ui/CopyAddress";

export const revalidate = 30;

export const metadata = {
  title: "Leaderboard – Janamat Engage",
  description: "Top civic voters ranked by on-chain engagement points.",
};

const podiumColors = ["bg-[#EA580C]", "bg-[#EAB308]", "bg-[#0891B2]"];
const podiumIcons = ["👑", "🥈", "🥉"];
const podiumLabels = ["1st Place", "2nd Place", "3rd Place"];

function getTier(points: number): { label: string; bg: string } {
  if (points >= 40) return { label: "Elite", bg: "bg-[#0891B2]" };
  if (points >= 20) return { label: "Champion", bg: "bg-[#EA580C]" };
  if (points >= 5) return { label: "Active", bg: "bg-[#EAB308]" };
  return { label: "Newcomer", bg: "bg-white" };
}

export default async function LeaderboardPage() {
  let entries: LeaderboardEntry[] = [];
  let error = false;
  let rateLimited = false;
  let stats = null;

  try {
    [entries, stats] = await Promise.all([
      fetchLeaderboard(100),
      fetchGlobalStats(),
    ]);
  } catch (e) {
    error = true;
    rateLimited = e instanceof Error && e.message === RATE_LIMIT_MESSAGE;
  }

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const maxPoints = entries[0]?.points || 1;
  const totalVotesOnChain =
    stats?.totalVotesRecorded ?? entries.reduce((s, e) => s + e.voteCount, 0);

  return (
    <div className="bg-[#FEFCE8] bg-grid min-h-screen">
      {/* Hero header */}
      <div className="pt-24 pb-16 px-4 border-b-[3px] border-black bg-[#FFFBEB]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-[#EA580C] border-2 border-black px-3 py-1 shadow-neo-sm rotate-1 mb-6">
            <span className="font-display font-bold text-xs uppercase tracking-widest text-white">
              Live · On-Chain Rankings
            </span>
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl uppercase leading-tight text-black mb-6">
            Civic Engagement
            <br />
            <span className="bg-[#EAB308] border-2 border-black px-3 inline-block -rotate-1 shadow-neo-sm">
              Leaderboard.
            </span>
          </h1>
          <p className="text-xl font-medium text-black/70 max-w-xl mx-auto mb-10">
            Real-time rankings from verified on-chain votes. Points tracked by
            the{" "}
            <code className="font-mono bg-[#EAB308] border border-black px-1 text-black">
              engage_registry
            </code>{" "}
            Solana program.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              {
                label: "Registered Voters",
                value: stats?.totalVoters ?? entries.length,
                bg: "bg-[#EA580C] text-white",
              },
              {
                label: "Votes On-Chain",
                value: totalVotesOnChain,
                bg: "bg-[#EAB308] text-black",
              },
              {
                label: "Network",
                value: "Solana Devnet",
                bg: "bg-[#0891B2] text-white",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.bg} border-2 border-black px-4 py-2 shadow-neo-sm flex items-center gap-3`}
              >
                <span className="font-display font-bold text-xs uppercase opacity-70">
                  {s.label}
                </span>
                <span className="font-display font-extrabold text-base">
                  {typeof s.value === "number"
                    ? s.value.toLocaleString()
                    : s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Error */}
        {error && (
          <div className="bg-white border-[3px] border-black p-5 shadow-neo flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-display font-extrabold uppercase text-base mb-1">
                {rateLimited ? "Too Many Requests" : "Backend Offline"}
              </p>
              <p className="font-medium text-sm text-black/70">
                {rateLimited
                  ? "You've hit the rate limit. Please wait a minute and refresh."
                  : (
                      <>
                        Could not load data. Make sure the backend is running at{" "}
                        <code className="font-mono bg-[#EAB308] border border-black px-1">
                          localhost:4000
                        </code>
                        .
                      </>
                    )}
              </p>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <div>
            <h2 className="font-display font-extrabold text-2xl uppercase mb-6 flex items-center gap-2 text-black">
              <span>👑</span> Top Performers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {top3.map((entry, i) => {
                const pct = Math.round((entry.points / maxPoints) * 100);
                const sl = streakLabel(entry.currentStreak);
                return (
                  <div
                    key={entry.voter}
                    className={`${podiumColors[i]} border-[3px] border-black p-7 shadow-neo-lg relative ${i === 0 ? "scale-[1.02]" : ""}`}
                  >
                    {i === 0 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border-2 border-black px-3 py-0.5 font-display font-bold text-xs uppercase shadow-neo-sm whitespace-nowrap">
                        Top Voter 🏆
                      </div>
                    )}
                    <div className="text-4xl mb-3">{podiumIcons[i]}</div>
                    <div className="font-display font-bold text-xs uppercase text-white/70 mb-1">
                      {podiumLabels[i]}
                    </div>
                    <p className="font-mono font-extrabold text-base text-white mb-1 break-all">
                      {truncateAddress(entry.voter, 8)}
                    </p>
                    {sl && (
                      <div className="mb-3">
                        <span className="bg-white/20 border border-white/40 px-2 py-0.5 font-display font-bold text-xs text-white">
                          {sl} · {entry.currentStreak}d streak
                        </span>
                      </div>
                    )}

                    {/* Bar */}
                    <div className="w-full bg-white/30 border-2 border-white/50 h-5 mb-3 p-[2px]">
                      <div
                        className="bg-white h-full border-r-2 border-white/70"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-extrabold text-4xl text-white">
                        {formatPoints(entry.points)}
                      </span>
                      <span className="font-display font-bold text-sm text-white/70 uppercase">
                        PTS
                      </span>
                    </div>
                    <div className="font-display text-xs text-white/60 mt-1">
                      {entry.voteCount} votes cast
                    </div>

                    <a
                      href={`https://explorer.solana.com/address/${entry.voter}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block bg-black text-white font-display font-bold text-xs px-3 py-1.5 border border-black uppercase neo-btn"
                    >
                      View on Explorer ↗
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full table */}
        {entries.length > 0 && (
          <div>
            <h2 className="font-display font-extrabold text-2xl uppercase mb-6 flex items-center gap-2 text-black">
              <span>📊</span> Full Rankings
              <span className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#EA580C] pulse-dot" />
                <span className="font-display font-bold text-xs text-black/60 uppercase">
                  Live · Refreshes every 30s
                </span>
              </span>
            </h2>

            <div className="border-[3px] border-black shadow-neo-lg overflow-hidden bg-white">
              {/* Col headers */}
              <div className="flex items-center gap-4 px-5 py-3 bg-[#111] text-white border-b-[3px] border-black">
                <div className="w-8 font-display font-bold text-xs uppercase text-white/60">
                  #
                </div>
                <div className="flex-1 font-display font-bold text-xs uppercase text-white/60">
                  Voter
                </div>
                <div className="hidden md:block w-20 text-right font-display font-bold text-xs uppercase text-white/60">
                  Streak
                </div>
                <div className="hidden md:block w-16 text-right font-display font-bold text-xs uppercase text-white/60">
                  Votes
                </div>
                <div className="w-16 text-right font-display font-bold text-xs uppercase text-white/60">
                  Points
                </div>
              </div>

              {entries.map((entry, i) => {
                const pct = Math.round((entry.points / maxPoints) * 100);
                const sl = streakLabel(entry.currentStreak);

                return (
                  <div
                    key={entry.voter}
                    className={`flex items-center gap-4 px-5 py-4 border-b-2 border-black last:border-0 hover:bg-[#FEFCE8] transition-colors group ${i === 0 ? "bg-[#FEF9EE]" : ""}`}
                  >
                    {/* Rank */}
                    <div className="w-8 shrink-0 text-center font-display font-extrabold text-sm text-black/40">
                      {i + 1}
                    </div>

                    {/* Wallet + bar */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CopyAddress address={entry.voter} />
                        <a
                          href={`https://explorer.solana.com/address/${entry.voter}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity font-display font-bold text-xs text-[#EA580C] border border-[#EA580C] px-1.5 py-0.5 leading-none"
                        >
                          ↗
                        </a>
                      </div>
                      <div className="w-full max-w-xs bg-gray-100 border border-black h-2.5 p-px">
                        <div
                          className="bg-[#EA580C] h-full border-r border-black"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Streak */}
                    <div className="hidden md:block w-20 text-right">
                      {entry.currentStreak > 0 && (
                        <span className="font-display font-bold text-xs text-black/70">
                          {sl || `${entry.currentStreak}d`}
                        </span>
                      )}
                    </div>

                    {/* Votes */}
                    <div className="hidden md:block w-16 text-right font-mono text-sm text-black/60">
                      {entry.voteCount}
                    </div>

                    {/* Points */}
                    <div className="w-16 text-right">
                      <span className="font-display font-extrabold text-lg text-black">
                        {formatPoints(entry.points)}
                      </span>
                      <span className="font-display font-bold text-xs text-black/40 ml-0.5">
                        PTS
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!error && entries.length === 0 && (
          <div className="border-[3px] border-dashed border-black py-20 text-center bg-white">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="font-display font-extrabold text-2xl uppercase text-black mb-3">
              No Votes Yet
            </h3>
            <p className="font-medium text-black/60 max-w-xs mx-auto mb-8">
              Be the first civic voter on Janamat to earn on-chain points and
              claim the top spot.
            </p>
            <a
              href="https://janamat.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#EA580C] text-white font-display font-extrabold text-base px-8 py-4 border-[3px] border-black shadow-neo neo-btn uppercase"
            >
              Cast Your First Vote →
            </a>
          </div>
        )}

        {/* Referral widget */}
        <ReferralWidget />

        {/* Footer note */}
        <p className="text-center font-mono text-xs text-black/40 pb-4">
          Rankings sourced from on-chain{" "}
          <code className="bg-[#EAB308] border border-black px-1">
            EngageProfile
          </code>{" "}
          PDAs ·{" "}
          <code className="bg-[#EAB308] border border-black px-1">
            engage_registry
          </code>{" "}
          program on Solana devnet
        </p>
      </div>
    </div>
  );
}
