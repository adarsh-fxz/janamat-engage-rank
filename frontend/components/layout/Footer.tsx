import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-black bg-[#FFFDF5] px-4 md:px-8 pb-8 pt-16">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b-2 border-black">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-8 h-8 bg-[#FF8A00] border-2 border-black shadow-neo-sm flex items-center justify-center font-display font-black text-black text-sm">
                J
              </div>
              <span className="font-display font-extrabold text-xl uppercase tracking-tighter text-black">
                JANAMAT<span className="text-[#FF8A00]">.</span>EARN
              </span>
            </Link>
            <p className="font-medium text-black/70 max-w-xs leading-relaxed text-sm mb-5">
              Gamified civic participation. Every vote on Janamat earns you
              on-chain points. Built for Superteam Earn Mini Hack.
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-[#FF8A00] border-2 border-black px-2 py-0.5 font-display font-bold text-xs uppercase text-black shadow-neo-sm">
                Node JS
              </div>
              <span className="font-display font-bold text-xs text-black/40">
                x
              </span>
              <div className="bg-[#00C2FF] border-2 border-black px-2 py-0.5 font-display font-bold text-xs uppercase text-black shadow-neo-sm">
                ANCHOR
              </div>
              <span className="font-display font-bold text-xs text-black/40">
                x
              </span>
              <div className="bg-[#FFE600] border-2 border-black px-2 py-0.5 font-display font-bold text-xs uppercase text-black shadow-neo-sm">
                Next.js
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display font-extrabold text-sm uppercase text-black/50 mb-4 tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/leaderboard", label: "Leaderboard" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/rewards", label: "Rewards" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-display font-bold text-sm uppercase text-black hover:text-[#FF8A00] transition-colors hover:underline decoration-2 underline-offset-4"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-extrabold text-sm uppercase text-black/50 mb-4 tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "https://janamat.app", label: "Janamat App ↗" },
                {
                  href: "https://superteam.fun/earn",
                  label: "Superteam Earn ↗",
                },
                { href: "https://solana.com", label: "Solana ↗" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display font-bold text-sm uppercase text-black hover:text-[#FF8A00] transition-colors hover:underline decoration-2 underline-offset-4"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display font-bold text-sm text-black/50 uppercase">
            © 2026 Janamat Engage Ranking. Built for Superteam Earn Mini Hack.
          </p>
          <p className="font-display font-bold text-sm text-black/50 uppercase">
            On-Chain Votes. Real Civic Impact.
          </p>
        </div>
      </div>
    </footer>
  );
}
