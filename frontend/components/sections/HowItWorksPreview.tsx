import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Cast Your Vote",
    desc: "Interact on Janamat and vote on active polls. Each submission triggers a Solana transaction via the cast_vote instruction.",
    bg: "bg-[#FF8A00]",
    textColor: "text-black",
  },
  {
    num: "02",
    title: "Event Emitted",
    desc: "The on-chain program fires a VoteCasted event encoded in transaction logs. Our backend listener picks it up instantly.",
    bg: "bg-[#FFE600]",
    textColor: "text-black",
  },
  {
    num: "03",
    title: "Points Awarded",
    desc: "We decode your voter wallet and award 1 point. Transaction signatures deduplicate everything - no double counting.",
    bg: "bg-[#00C2FF]",
    textColor: "text-black",
  },
  {
    num: "04",
    title: "Climb the Board",
    desc: "Points accumulate in real-time. Top 20 voters are ranked live on the leaderboard. Lead your constituency.",
    bg: "bg-white",
    textColor: "text-black",
  },
];

export function HowItWorksPreview() {
  return (
    <section className="py-24 px-4 bg-[#FFFDF5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block bg-[#00C2FF] border-2 border-black px-3 py-1 shadow-neo-sm -rotate-1 mb-6">
            <span className="font-display font-bold text-xs uppercase tracking-widest text-black">
              How It Works
            </span>
          </div>
          <h2 className="font-display font-extrabold text-5xl md:text-6xl uppercase leading-tight text-black">
            Vote. Earn. <span className="bg-black text-white px-2">Lead.</span>
          </h2>
          <p className="mt-6 text-xl font-medium max-w-xl mx-auto text-black/70">
            A transparent on-chain incentive loop that turns civic participation
            into measurable points.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`${s.bg} border-[3px] border-black p-8 shadow-neo-lg hover:-translate-y-1 transition-transform relative group`}
            >
              <div className="absolute top-4 right-4 text-6xl font-display font-extrabold text-black/20 group-hover:text-black/40 select-none transition-colors">
                {s.num}
              </div>
              <h3
                className={`font-display font-extrabold text-2xl uppercase mb-4 ${s.textColor}`}
              >
                {s.title}
              </h3>
              <p
                className={`font-medium leading-relaxed text-sm ${s.textColor}/80`}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/how-it-works"
            className="inline-block bg-white text-black font-display font-extrabold text-base px-8 py-4 border-[3px] border-black shadow-neo neo-btn uppercase"
          >
            Deep Dive →
          </Link>
        </div>
      </div>
    </section>
  );
}
