import Link from "next/link";

export const metadata = {
  title: "How It Works | Janamat Engage Ranking",
  description:
    "The full technical pipeline: from on-chain vote to leaderboard points.",
};

const pipeline = [
  {
    step: "01",
    title: "Vote on Janamat",
    desc: "The user submits a vote via the Janamat app. This calls the cast_vote instruction on the vote_program Anchor program deployed on Solana devnet.",
    tech: "cast_vote · vote_program · Solana Devnet",
    bg: "bg-[#EA580C]",
    textColor: "text-white",
  },
  {
    step: "02",
    title: "VoteCasted Event Emitted",
    desc: "The program emits a VoteCasted event in transaction logs with voter pubkey, poll index, and vote type (YesNo, SingleChoice, Ranked, MultipleChoice).",
    tech: "VoteCasted · Anchor BorshCoder · Program Logs",
    bg: "bg-[#EAB308]",
    textColor: "text-black",
  },
  {
    step: "03",
    title: "Backend Listener Decodes",
    desc: "Our Express backend subscribes to program logs via connection.onLogs. It decodes the event using the vote_program IDL and extracts voter details.",
    tech: "connection.onLogs · @solana/web3.js · Express",
    bg: "bg-[#0891B2]",
    textColor: "text-white",
  },
  {
    step: "04",
    title: "engage_registry Awards Points",
    desc: "The backend calls award_points on our engage_registry Anchor program. This updates the voter's on-chain EngageProfile PDA. Points accumulate with streak bonuses (base 1 pt + up to 2 bonus pts for consecutive daily votes).",
    tech: "engage_registry · EngageProfile PDA · Streak Logic",
    bg: "bg-[#FFFBEB]",
    textColor: "text-black",
  },
  {
    step: "05",
    title: "Leaderboard Direct from Chain",
    desc: "GET /leaderboard fetches all EngageProfile accounts directly from Solana using program.account.engageProfile.all(). No database the chain IS the source of truth. Sorted by totalPoints.",
    tech: "engageProfile.all() · GET /leaderboard · Next.js ISR",
    bg: "bg-[#EA580C]",
    textColor: "text-white",
  },
];

const techStack = [
  {
    label: "Solana",
    desc: "On-chain voting + registry",
    color: "bg-[#EA580C] text-white",
  },
  {
    label: "Anchor 0.32",
    desc: "BorshCoder + IDL + CPI",
    color: "bg-[#EAB308] text-black",
  },
  {
    label: "engage_registry",
    desc: "Our Anchor program",
    color: "bg-[#0891B2] text-white",
  },
  {
    label: "Express.js",
    desc: "REST API backend",
    color: "bg-[#FFFBEB] text-black",
  },
  {
    label: "Next.js 16",
    desc: "App Router + ISR",
    color: "bg-[#EA580C] text-white",
  },
  {
    label: "Tailwind v4",
    desc: "Utility CSS",
    color: "bg-[#EAB308] text-black",
  },
  {
    label: "Space Grotesk",
    desc: "Display font",
    color: "bg-[#0891B2] text-white",
  },
  {
    label: "EngageProfile PDA",
    desc: "On-chain leaderboard",
    color: "bg-[#FFFBEB] text-black",
  },
];

const guarantees = [
  {
    icon: "🔒",
    title: "Fully On-Chain",
    desc: "Points are stored in EngageProfile PDAs on Solana not in any database. Anyone can independently verify any voter's score using the program's public key.",
  },
  {
    icon: "⚡",
    title: "Real-Time Updates",
    desc: "The backend listener runs 24/7 via connection.onLogs. VoteCasted events are decoded and awarded on-chain within seconds of finality.",
  },
  {
    icon: "🔥",
    title: "Streak Bonuses",
    desc: "The engage_registry program tracks daily voting streaks on-chain. Base 1 pt per vote + up to 2 bonus pts for consistent voting every 24-48 hours. Maximum 3 points per vote.",
  },
  {
    icon: "🛡️",
    title: "Immutable Rewards",
    desc: "Points earned are permanent and cannot be revoked. Once you vote and earn points, they're yours forever building trust and fairness into the system.",
  },
];

const schema = {
  "EngageProfile PDA": [
    ["voter", "Pubkey (PDA seed)"],
    ["total_points", "u64"],
    ["vote_count", "u64"],
    ["current_streak", "u32"],
    ["longest_streak", "u32"],
    ["last_vote_timestamp", "i64"],
  ],
  "GlobalState PDA": [
    ["authority", "Pubkey"],
    ["total_voters", "u64"],
    ["total_votes_recorded", "u64"],
  ],
};

export default function HowItWorksPage() {
  return (
    <div className="bg-[#FEFCE8] bg-grid min-h-screen">
      {/* Hero */}
      <div className="pt-24 pb-16 px-4 border-b-[3px] border-black bg-[#FFFBEB]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#0891B2] border-2 border-black px-3 py-1 shadow-neo-sm -rotate-1 mb-6">
            <span className="font-display font-bold text-xs uppercase tracking-widest text-white">
              Technical Deep Dive
            </span>
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl uppercase leading-tight text-black mb-6">
            How Janamat
            <br />
            <span className="bg-[#EA580C] border-2 border-black px-3 inline-block rotate-1 shadow-neo-sm text-white">
              Engage Works.
            </span>
          </h1>
          <p className="text-xl font-medium text-black/70 max-w-2xl mx-auto">
            An end-to-end pipeline that converts on-chain Solana votes into
            gamified civic points transparently and in real-time.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">
        {/* Pipeline */}
        <section>
          <h2 className="font-display font-extrabold text-3xl uppercase mb-8 flex items-center gap-3 text-black">
            <span className="bg-[#EAB308] border-2 border-black px-3 py-1 text-sm shadow-neo-sm text-black">
              ⚡
            </span>
            The Vote-to-Points Pipeline
          </h2>

          <div className="relative space-y-4">
            {pipeline.map((s, i) => (
              <div key={s.step} className="relative flex gap-5 items-stretch">
                {/* Connector */}
                {i < pipeline.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 bg-black h-[calc(100%+16px)]" />
                )}

                {/* Step circle */}
                <div
                  className={`relative flex h-12 w-12 shrink-0 items-center justify-center border-[3px] border-black font-display font-extrabold text-sm ${s.bg} ${s.textColor} shadow-neo-sm`}
                >
                  {s.step}
                </div>

                {/* Card */}
                <div className="flex-1 bg-white border-[3px] border-black shadow-neo-sm p-5 hover:shadow-neo transition-shadow">
                  <h3 className="font-display font-extrabold text-lg uppercase text-black mb-2">
                    {s.title}
                  </h3>
                  <p className="font-medium text-sm text-black/70 leading-relaxed mb-3">
                    {s.desc}
                  </p>
                  <span
                    className={`inline-block ${s.bg} ${s.textColor} border-2 border-black px-2.5 py-0.5 font-mono font-bold text-xs`}
                  >
                    {s.tech}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-[3px] bg-black" />

        {/* Tech Stack */}
        <section>
          <h2 className="font-display font-extrabold text-3xl uppercase mb-3 text-black flex items-center gap-3">
            <span className="bg-[#EA580C] border-2 border-black px-3 py-1 text-sm shadow-neo-sm text-white">
              🔧
            </span>
            Tech Stack
          </h2>
          <p className="font-medium text-black/60 mb-8">
            Purposefully chosen for the Superteam Earn Mini Hack scope.
          </p>

          <div className="flex flex-wrap gap-3">
            {techStack.map((t) => (
              <div
                key={t.label}
                className={`${t.color} border-2 border-black px-4 py-2.5 shadow-neo-sm flex items-center gap-2.5`}
              >
                <span className="font-display font-extrabold text-sm">
                  {t.label}
                </span>
                <span className="font-medium text-xs opacity-60 hidden sm:inline">
                  · {t.desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-[3px] bg-black" />

        {/* Integrity */}
        <section>
          <h2 className="font-display font-extrabold text-3xl uppercase mb-3 text-black flex items-center gap-3">
            <span className="bg-[#0891B2] border-2 border-black px-3 py-1 text-sm shadow-neo-sm text-white">
              🛡️
            </span>
            Integrity Guarantees
          </h2>
          <p className="font-medium text-black/60 mb-8">
            The system is designed to be trustworthy, fair, and resilient.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {guarantees.map((g) => (
              <div
                key={g.title}
                className="bg-white border-[3px] border-black p-6 shadow-neo-sm hover:shadow-neo transition-shadow flex gap-4"
              >
                <div className="text-3xl shrink-0">{g.icon}</div>
                <div>
                  <h3 className="font-display font-extrabold text-base uppercase text-black mb-2">
                    {g.title}
                  </h3>
                  <p className="font-medium text-sm text-black/70 leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-[3px] bg-black" />

        {/* Schema */}
        <section>
          <h2 className="font-display font-extrabold text-3xl uppercase mb-3 text-black flex items-center gap-3">
            <span className="bg-[#EAB308] border-2 border-black px-3 py-1 text-sm shadow-neo-sm text-black">
              ⛓️
            </span>
            On-Chain Data Schema
          </h2>
          <p className="font-medium text-black/60 mb-8">
            Two on-chain Anchor accounts replace the database entirely.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(Object.entries(schema) as [string, string[][]][]).map(
              ([model, fields], mi) => (
                <div
                  key={model}
                  className={`${mi === 0 ? "bg-[#EA580C]" : "bg-[#0891B2]"} border-[3px] border-black p-5 shadow-neo`}
                >
                  <p className="font-display font-extrabold text-lg uppercase mb-4 text-white border-b-2 border-white/40 pb-2">
                    {model}
                  </p>
                  <div className="space-y-1.5 font-mono text-sm">
                    {fields.map(([field, type]) => (
                      <div
                        key={field}
                        className="flex justify-between items-baseline gap-4"
                      >
                        <span className="font-bold text-white">{field}</span>
                        <span className="text-white/60 text-xs text-right">
                          {type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#EAB308] border-[3px] border-black p-10 text-center shadow-neo-lg relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10">
            <h3 className="font-display font-extrabold text-3xl uppercase text-black mb-3">
              Ready to participate?
            </h3>
            <p className="font-medium text-black/70 mb-8 max-w-md mx-auto">
              Every vote you cast on Janamat is verified on-chain and earns you
              points.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://janamat.app"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white font-display font-extrabold text-base px-8 py-4 border-[3px] border-black shadow-neo neo-btn uppercase inline-block"
              >
                Open Janamat →
              </a>
              <Link
                href="/leaderboard"
                className="bg-white text-black font-display font-extrabold text-base px-8 py-4 border-[3px] border-black shadow-neo neo-btn uppercase inline-block"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
