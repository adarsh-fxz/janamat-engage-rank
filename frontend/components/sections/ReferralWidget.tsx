"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
// Referral links go directly to janamat.app signin with the ref param
const SIGNUP_URL = "https://janamat.app/signin";

export function ReferralWidget() {
  const [wallet, setWallet] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{
    totalReferrals: number;
    todayReferrals: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setError("");
    const addr = wallet.trim();
    if (!addr || addr.length < 32) {
      setError("Enter a valid Solana wallet address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/referral/stats/${addr}`);
      if (!res.ok) throw new Error("Could not fetch stats");
      const data = await res.json();
      setStats(data);
      setLink(`${SIGNUP_URL}?ref=${addr}`);
    } catch {
      setError("Could not fetch stats. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border-[3px] border-black bg-white shadow-neo-lg p-7">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-[#EAB308] border-2 border-black w-10 h-10 flex items-center justify-center text-xl shrink-0 shadow-neo-sm">
          🔗
        </div>
        <div>
          <h3 className="font-display font-extrabold text-xl uppercase text-black leading-tight">
            Refer & Earn
          </h3>
          <p className="text-sm font-medium text-black/60 mt-1">
            Share your link. When someone signs in on Janamat via your link and casts their first vote, you earn{" "}
            <span className="font-bold text-black">+1 point</span> — up to{" "}
            <span className="font-bold text-black">2 per day</span>.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="flex gap-3 mb-6">
        {[
          { step: "01", text: "Enter your wallet" },
          { step: "02", text: "Copy signup link" },
          { step: "03", text: "They sign up + vote" },
        ].map((s) => (
          <div
            key={s.step}
            className="flex-1 border-2 border-black/20 p-3 text-center"
          >
            <div className="font-mono font-bold text-[10px] text-[#EA580C] mb-1">
              {s.step}
            </div>
            <div className="font-display font-bold text-xs uppercase text-black/70 leading-tight">
              {s.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="Your wallet address..."
          className="flex-1 border-[3px] border-black px-3 py-2 font-mono text-xs text-black placeholder-black/30 outline-none focus:bg-[#FFFBEB] bg-white"
        />
        <button
          onClick={generate}
          disabled={loading}
          className="bg-[#EA580C] text-white font-display font-extrabold text-xs px-4 py-2 border-2 border-black shadow-neo-sm neo-btn uppercase disabled:opacity-50"
        >
          {loading ? "..." : "Generate"}
        </button>
      </div>

      {error && (
        <p className="font-mono text-xs text-red-600 mb-4 border border-red-200 bg-red-50 px-3 py-2">
          {error}
        </p>
      )}

      {/* Generated link */}
      {link && (
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <div className="flex-1 border-[3px] border-black bg-[#FFFBEB] px-3 py-2 font-mono text-xs text-black/70 truncate">
              {link}
            </div>
            <button
              onClick={copy}
              className={`shrink-0 font-display font-extrabold text-xs px-4 py-2 border-2 border-black shadow-neo-sm neo-btn uppercase ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-black text-white"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-black p-3 bg-[#EAB308]">
                <div className="font-display font-black text-2xl text-black">
                  {stats.totalReferrals}
                </div>
                <div className="font-display font-bold text-xs uppercase text-black/70">
                  Total Referrals
                </div>
              </div>
              <div className="border-2 border-black p-3 bg-white">
                <div className="font-display font-black text-2xl text-black">
                  {stats.todayReferrals}
                  <span className="text-sm font-bold text-black/40">/2</span>
                </div>
                <div className="font-display font-bold text-xs uppercase text-black/70">
                  Used Today
                </div>
              </div>
            </div>
          )}

          <p className="font-mono text-[10px] text-black/40">
            Link goes to janamat.app/signin. Point awarded on-chain after the
            referred user signs in and casts their first vote
          </p>
        </div>
      )}
    </div>
  );
}
