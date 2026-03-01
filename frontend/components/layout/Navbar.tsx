"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/rewards", label: "Rewards" },
  { href: "/how-it-works", label: "How It Works" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b-[3px] border-black bg-white fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#FF8A00] border-2 border-black shadow-neo-sm flex items-center justify-center font-display font-black text-black text-sm neo-btn">
            E R
          </div>
          <span className="font-display font-extrabold text-xl uppercase tracking-tighter text-black">
            Engage Rank
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 font-display font-bold text-sm uppercase tracking-wide">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`hover:underline decoration-2 underline-offset-4 transition-colors ${
                pathname === l.href ? "underline text-[#FF8A00]" : "text-black"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://janamat.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FF8A00] text-black font-display font-extrabold text-sm px-5 py-2 border-2 border-black shadow-neo-sm neo-btn uppercase"
          >
            Start Voting →
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden w-9 h-9 border-2 border-black bg-white flex items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5 w-4">
            <span
              className={`block h-0.5 bg-black transition-all ${open ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 bg-black transition-all ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 bg-black transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t-2 border-black bg-white px-6 py-4 space-y-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block font-display font-bold uppercase text-sm py-2 border-b border-black/10 ${
                pathname === l.href ? "text-[#FF8A00]" : "text-black"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://janamat.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-center bg-[#FF8A00] text-black font-display font-extrabold text-sm px-5 py-2.5 border-2 border-black shadow-neo-sm uppercase"
          >
            Start Voting →
          </a>
        </div>
      )}
    </header>
  );
}
