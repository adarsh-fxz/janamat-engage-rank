"use client";

import { useState, useMemo } from "react";
import { type LeaderboardEntry } from "@/lib/api";
import { truncateAddress, formatPoints, streakLabel } from "@/lib/api";
import { CopyAddress } from "@/components/ui/CopyAddress";

type SortMode = "points" | "recent";

function formatLastVoted(lastVoteTimestamp: number): string {
  if (!lastVoteTimestamp) return "No votes yet";
  const nowMs = Date.now();
  const voteMs = lastVoteTimestamp * 1000;
  const diffSeconds = Math.max(0, Math.floor((nowMs - voteMs) / 1000));
  if (diffSeconds < 60) return "Just now";
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

const PAGE_SIZE = 20;

export function FullRankings({
  entries,
  maxPoints,
}: {
  entries: LeaderboardEntry[];
  maxPoints: number;
}) {
  const [sort, setSort] = useState<SortMode>("points");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const base = [...entries];
    if (sort === "points") {
      base.sort((a, b) => b.points - a.points);
    } else {
      base.sort((a, b) => b.lastVoteTimestamp - a.lastVoteTimestamp);
    }
    return base;
  }, [entries, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  const trimmed = query.trim().toLowerCase();

  const searchResult = useMemo(() => {
    if (!trimmed) return null;
    return entries.find((e) => e.voter.toLowerCase().includes(trimmed)) ?? null;
  }, [entries, trimmed]);

  const displayRows = trimmed ? (searchResult ? [searchResult] : []) : pageRows;

  // rank of the searched address in the points-sorted full list
  const pointsRanked = useMemo(
    () => [...entries].sort((a, b) => b.points - a.points),
    [entries],
  );

  return (
    <div>
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <h2 className="font-display font-extrabold text-2xl uppercase flex items-center gap-2 text-black">
          <span>📊</span> Full Rankings
          <span className="hidden sm:flex ml-2 items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#EA580C] pulse-dot" />
            <span className="font-display font-bold text-xs text-black/60 uppercase">
              Live · Refreshes every 30s
            </span>
          </span>
        </h2>

        {/* Sort toggle */}
        <div className="flex items-center gap-0 border-2 border-black overflow-hidden self-start sm:ml-auto">
          <button
            onClick={() => { setSort("points"); setPage(1); }}
            className={`px-4 py-2 font-display font-bold text-xs uppercase transition-colors border-r-2 border-black ${
              sort === "points"
                ? "bg-[#EA580C] text-white"
                : "bg-white text-black hover:bg-[#FEFCE8]"
            }`}
          >
            Top Points
          </button>
          <button
            onClick={() => { setSort("recent"); setPage(1); }}
            className={`px-4 py-2 font-display font-bold text-xs uppercase transition-colors ${
              sort === "recent"
                ? "bg-[#EAB308] text-black"
                : "bg-white text-black hover:bg-[#FEFCE8]"
            }`}
          >
            Most Recent
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-5 relative">
        <div className="flex items-stretch border-2 border-black shadow-neo-sm bg-white overflow-hidden">
          <div className="flex items-center px-3 bg-[#111] border-r-2 border-black shrink-0">
            <span className="font-display font-bold text-xs text-white uppercase tracking-wider">
              Search
            </span>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste a public address to look up their stats…"
            spellCheck={false}
            className="flex-1 px-4 py-3 font-mono text-sm text-black bg-white placeholder:text-black/30 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="px-3 font-display font-bold text-sm text-black/40 hover:text-black transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search result card — shown when searching */}
        {trimmed && (
          <div className="mt-3">
            {searchResult ? (
              (() => {
                const rank =
                  pointsRanked.findIndex((e) => e.voter === searchResult.voter) +
                  1;
                const sl = streakLabel(searchResult.currentStreak);
                const lastVoted = formatLastVoted(
                  searchResult.lastVoteTimestamp,
                );
                const pct = Math.round(
                  (searchResult.points / maxPoints) * 100,
                );
                return (
                  <div className="border-[3px] border-black bg-white shadow-neo-lg p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="font-display font-bold text-xs uppercase text-black/50 mb-1">
                          Address Found · Rank #{rank}
                        </div>
                        <p className="font-mono font-extrabold text-base text-black break-all">
                          {searchResult.voter}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-display font-extrabold text-3xl text-black leading-none">
                          {formatPoints(searchResult.points)}
                        </div>
                        <div className="font-display font-bold text-xs text-black/50 uppercase">
                          Points
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 border border-black h-3 p-px mb-4">
                      <div
                        className="bg-[#EA580C] h-full border-r border-black"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        {
                          label: "Votes Cast",
                          value: searchResult.voteCount,
                          bg: "bg-[#EAB308]",
                        },
                        {
                          label: "Current Streak",
                          value: searchResult.currentStreak
                            ? `${searchResult.currentStreak}d${sl ? ` · ${sl}` : ""}`
                            : "—",
                          bg: "bg-[#0891B2] text-white",
                        },
                        {
                          label: "Last Voted",
                          value: lastVoted,
                          bg: "bg-white",
                        },
                        {
                          label: "Global Rank",
                          value: `#${rank}`,
                          bg: "bg-[#EA580C] text-white",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className={`${stat.bg} border-2 border-black p-3`}
                        >
                          <div className="font-display font-bold text-[10px] uppercase text-current opacity-60 mb-1">
                            {stat.label}
                          </div>
                          <div className="font-display font-extrabold text-sm leading-tight">
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <a
                      href={`https://explorer.solana.com/address/${searchResult.voter}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block bg-black text-white font-display font-bold text-xs px-3 py-1.5 border border-black uppercase neo-btn"
                    >
                      View on Explorer ↗
                    </a>
                  </div>
                );
              })()
            ) : (
              <div className="border-2 border-dashed border-black bg-white py-8 text-center">
                <p className="font-display font-bold text-sm uppercase text-black/40">
                  No voter found matching that address
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table — hidden while searching (results shown above) */}
      {!trimmed && (
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

          {pageRows.map((entry, i) => {
            const pct = Math.round((entry.points / maxPoints) * 100);
            const sl = streakLabel(entry.currentStreak);
            const lastVoted = formatLastVoted(entry.lastVoteTimestamp);
            // real rank by points regardless of current sort
            const rank =
              pointsRanked.findIndex((e) => e.voter === entry.voter) + 1;

            return (
              <div
                key={entry.voter}
                className={`flex items-center gap-4 px-5 py-4 border-b-2 border-black last:border-0 hover:bg-[#FEFCE8] transition-colors group ${i === 0 ? "bg-[#FEF9EE]" : ""}`}
              >
                {/* Rank (by points) */}
                <div className="w-8 shrink-0 text-center font-display font-extrabold text-sm text-black/40">
                  {sort === "points" ? (page - 1) * PAGE_SIZE + i + 1 : rank}
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
                  <div className="mt-1 font-display text-[11px] text-black/50">
                    Last vote · {lastVoted}
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

          {/* Pagination footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 bg-[#F9F5E7] border-t-[3px] border-black">
              <span className="font-display font-bold text-xs text-black/50 uppercase">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
              </span>
              <div className="flex items-center gap-0 border-2 border-black overflow-hidden">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 font-display font-bold text-xs uppercase border-r-2 border-black bg-white hover:bg-[#FEFCE8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>

                {/* Page number pills */}
                {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "…")[]>((acc, p, i, arr) => {
                    if (i > 0 && typeof arr[i - 1] === "number" && (p as number) - (arr[i - 1] as number) > 1) {
                      acc.push("…");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "…" ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-3 py-2 font-display font-bold text-xs border-r-2 border-black bg-white text-black/40 select-none"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item as number)}
                        className={`px-3 py-2 font-display font-bold text-xs border-r-2 border-black transition-colors ${
                          page === item
                            ? "bg-[#EA580C] text-white"
                            : "bg-white text-black hover:bg-[#FEFCE8]"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 font-display font-bold text-xs uppercase bg-white hover:bg-[#FEFCE8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
