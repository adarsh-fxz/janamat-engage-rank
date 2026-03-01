"use client";

import { useState } from "react";

function truncate(address: string, chars = 6): string {
  if (address.length < chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      title="Click to copy full address"
      className="font-mono font-bold text-sm text-black cursor-copy hover:text-[#EA580C] transition-colors"
    >
      {copied ? (
        <span className="text-green-600">Copied!</span>
      ) : (
        truncate(address)
      )}
    </button>
  );
}
