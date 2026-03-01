import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-grid pt-28 pb-20 px-4 min-h-screen flex items-center bg-[#FFFDF5]">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-16 md:gap-20">
        {/* Left */}
        <div className="w-full md:w-1/2 space-y-8">
          {/* Eyebrow tag */}
          <div className="inline-block bg-[#FFE600] border-2 border-black px-4 py-1 shadow-neo-sm -rotate-2">
            <span className="font-display font-bold text-xs uppercase tracking-widest text-black">
              🏆 Superteam Earn · Mini Hack
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tighter uppercase text-black">
            Earn Points
            <br />
            <span className="bg-[#FF8A00] px-2 text-black inline-block rotate-1 mt-2 shadow-neo-sm">
              for Voting.
            </span>
          </h1>

          {/* Sub tags */}
          <div className="flex flex-col gap-2 font-display text-xl font-bold uppercase">
            <div className="bg-black text-white px-3 py-2 w-fit -rotate-1">
              On-Chain Verified.
            </div>
            <div className="bg-[#00C2FF] text-black border-2 border-black px-3 py-2 w-fit rotate-1 shadow-neo-sm">
              Real-Time Points.
            </div>
            <div className="bg-[#FF8A00] text-black border-2 border-black px-3 py-2 w-fit -rotate-1 shadow-neo-sm">
              Top 20 Leaderboard.
            </div>
          </div>

          {/* Body */}
          <p className="text-lg md:text-xl font-medium max-w-md border-l-4 border-black pl-4 py-2 text-black/80">
            Every vote you cast on Janamat is recorded on Solana. Earn 1 point
            per vote, climb constituency rankings, and prove your civic
            commitment permanently on-chain.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href="https://janamat.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF8A00] text-black font-display font-extrabold text-lg px-8 py-4 border-[3px] border-black shadow-neo neo-btn uppercase inline-block text-center"
            >
              Start Voting →
            </a>
            <Link
              href="/leaderboard"
              className="bg-white text-black font-display font-extrabold text-lg px-8 py-4 border-[3px] border-black shadow-neo neo-btn uppercase inline-block text-center"
            >
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* Right: live poll card */}
        <div className="w-full md:w-1/2 relative">
          {/* Decorative shapes */}
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-[#FFE600] border-[3px] border-black z-0 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-[#FF8A00] border-[3px] border-black z-0 rotate-45" />

          {/* Card */}
          <div className="relative bg-white border-[3px] border-black shadow-neo-lg z-10 p-6">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-black" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black" />
                <div className="w-3 h-3 rounded-full bg-green-500 border border-black" />
              </div>
              <div className="bg-[#FFFDF5] border border-black px-3 py-1 text-xs font-mono">
                Solana Devnet · Live
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-block bg-[#FFE600] border-2 border-black px-2 py-0.5 text-xs font-display font-bold uppercase">
                Active Poll #7
              </div>
              <p className="font-display font-bold text-xl uppercase">
                Should constituency budgets be publicly audited quarterly?
              </p>

              {/* Bars */}
              {[
                { label: "YES", pct: 72, color: "bg-[#FF8A00]" },
                { label: "NO", pct: 28, color: "bg-[#00C2FF]" },
              ].map((o) => (
                <div key={o.label}>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>{o.label}</span>
                    <span>{o.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 border-2 border-black h-6 p-[2px]">
                    <div
                      className={`${o.color} h-full border-r-2 border-black`}
                      style={{ width: `${o.pct}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Points hint */}
              <div className="bg-[#FFE600] border-2 border-black p-3 flex items-center justify-between mt-2">
                <span className="font-display font-bold text-sm uppercase">
                  Vote & Earn
                </span>
                <span className="font-display font-extrabold text-2xl">
                  +1 PT
                </span>
              </div>

              <a
                href="https://janamat.app"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-black text-white font-display font-extrabold py-3 border-2 border-black uppercase neo-btn hover:bg-gray-900 text-center"
              >
                Cast Vote on Janamat ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
