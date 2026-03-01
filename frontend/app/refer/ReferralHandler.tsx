"use client";

/**
 * ReferralHandler — runs on the client when a user lands with ?ref=WALLET.
 * It reads the referee's wallet from their browser (if they've voted before,
 * their wallet is in localStorage from janamat.app) and POSTs to the backend.
 *
 * If the referee wallet isn't in localStorage, we store the referrer address
 * in localStorage so it can be submitted once the user connects their wallet.
 */

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function ReferralHandler({ referrer }: { referrer: string }) {
  const [status, setStatus] = useState<"pending" | "success" | "skipped">(
    "pending",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!referrer) return;

    // Store referrer in localStorage — the site/janamat.app can read this
    // when the user connects their wallet and submit the referral then.
    localStorage.setItem("janamat_referrer", referrer);

    // Check if we already know this user's wallet (stored by janamat.app)
    const knownWallet =
      localStorage.getItem("janamat_wallet") ||
      localStorage.getItem("walletAddress");

    if (!knownWallet || knownWallet === referrer) {
      // Store for later — referral will fire when they vote
      setStatus("skipped");
      setMessage(
        "Referral link saved! Your referrer will earn points when you cast your first vote.",
      );
      return;
    }

    // We know who they are — submit immediately
    fetch(`${API_BASE}/referral/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referee: knownWallet, referrer }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage("Referral recorded! Your referrer earned a point.");
        } else {
          setStatus("skipped");
          setMessage(data.error || "Referral already recorded.");
        }
      })
      .catch(() => {
        setStatus("skipped");
        setMessage("Referral link saved for when you vote.");
      });
  }, [referrer]);

  const icon =
    status === "success" ? "✅" : status === "skipped" ? "🔗" : "⏳";
  const bg =
    status === "success"
      ? "bg-green-50 border-green-400"
      : "bg-[#FFFBEB] border-[#EAB308]";

  return (
    <div className={`border-[3px] ${bg} p-5 shadow-neo-sm`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-display font-extrabold text-base uppercase text-black">
            {status === "success" ? "Referral Confirmed!" : "Referral Link Active"}
          </p>
          <p className="font-medium text-sm text-black/60 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}
