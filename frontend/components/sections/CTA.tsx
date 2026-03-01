import Link from "next/link";

export function CTA() {
  return (
    <section className="px-4 md:px-8 pb-8 pt-12 bg-[#FFFDF5] border-t-[3px] border-black">
      <div className="bg-[#01C3E7] border-[3px] border-black p-12 md:p-20 text-center shadow-neo-lg relative overflow-hidden">
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10">
          <h2 className="font-display font-extrabold text-4xl md:text-6xl uppercase mb-6 text-black leading-tight">
            Ready to cast
            <br />
            your vote?
          </h2>
          <p className="text-xl font-medium text-black/80 mb-10 max-w-2xl mx-auto">
            Stop sitting on the sidelines. Every vote earns you on-chain points.
            Join the leaderboard and lead your constituency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="https://janamat.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white font-display font-extrabold text-xl px-10 py-5 border-[3px] border-black shadow-neo neo-btn uppercase inline-block"
            >
              Launch Janamat →
            </a>
            <Link
              href="/leaderboard"
              className="bg-white text-black font-display font-extrabold text-xl px-10 py-5 border-[3px] border-black shadow-neo neo-btn uppercase inline-block"
            >
              See Rankings
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
