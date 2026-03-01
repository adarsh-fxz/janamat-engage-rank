import Link from "next/link";
import { FaqSection } from "./FaqSection";

export const metadata = {
  title: "Rewards | Janamat Engage Ranking",
  description:
    "Earn real physical and digital rewards by voting on Janamat and referring friends. Stickers, hoodies, NFTs and more.",
};

const milestones = [
  {
    pts: 100,
    icon: "✉️",
    title: "Voter Sticker Pack",
    subtitle: "100 points",
    desc: "Get an exclusive Superteam Nepal sticker pack mailed to you - a badge of civic pride for your laptop, water bottle, or notebook.",
    reward: "Physical Sticker Pack",
    tag: "FIRST REWARD",
    tagBg: "bg-[#EAB308]",
    tagText: "text-black",
    cardBg: "bg-white",
    accentBg: "bg-[#EAB308]",
    accentText: "text-black",
    featured: false,
  },
  {
    pts: 200,
    icon: "🧥",
    title: "Superteam Nepal Hoodie",
    subtitle: "200 points — the big one",
    desc: "The most coveted piece in the Superteam Nepal ecosystem. A full Superteam Nepal hoodie, shipped to your door. Only the most dedicated voters reach this milestone.",
    reward: "Superteam Nepal Hoodie",
    tag: "LEGENDARY",
    tagBg: "bg-[#EA580C]",
    tagText: "text-white",
    cardBg: "bg-[#FFFBEB]",
    accentBg: "bg-[#EA580C]",
    accentText: "text-white",
    featured: true,
  },
  {
    pts: 500,
    icon: "🏅",
    title: "On-Chain Civic NFT",
    subtitle: "500 points",
    desc: "A one-of-a-kind soulbound NFT minted on Solana, permanently marking your wallet as a top civic contributor in Nepal's democratic history.",
    reward: "Soulbound NFT Badge",
    tag: "COMING SOON",
    tagBg: "bg-[#0891B2]",
    tagText: "text-white",
    cardBg: "bg-white",
    accentBg: "bg-[#0891B2]",
    accentText: "text-white",
    featured: false,
  },
];

const faqs = [
  {
    q: "How do I claim my reward?",
    a: "Once you hit a milestone, submit your claim through the official Superteam Nepal Discord. We verify your on-chain points, then ship or mint your reward within 2-4 weeks.",
  },
  {
    q: "Do I need to claim in order?",
    a: "No. Each milestone is independent. If you hit 200 points, you can claim the hoodie directly without claiming the sticker pack first.",
  },
  {
    q: "Can I earn a reward more than once?",
    a: "Physical rewards (stickers, hoodie) are claimable once per wallet. On-chain NFTs are permanent once granted.",
  },
  {
    q: "How does Refer & Earn work?",
    a: "Share your Janamat referral link with friends. When they land on the site with your link and sign up, then cast their first vote, a referral is recorded on-chain and your referrer wallet earns bonus engagement points.",
  },
  {
    q: "Do referral points count toward my milestones?",
    a: "Yes. Referral points are added to the same on-chain EngageProfile as your voting points, so successful referrals help you cross sticker, hoodie, and NFT milestones faster.",
  },
  {
    q: "Is this only for Nepal?",
    a: "Physical rewards are currently shipped within Nepal only. On-chain rewards (NFT) are global.",
  },
];

export default function RewardsPage() {
  return (
    <main className="min-h-screen bg-[#FEFCE8] bg-grid">
      {/* Hero */}
      <section className="pt-24 pb-16 px-4 border-b-[3px] border-black bg-[#FFFBEB]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#EA580C] border-2 border-black px-3 py-1 shadow-neo-sm rotate-1 mb-6">
            <span className="font-display font-bold text-xs uppercase tracking-widest text-white">
              Real Rewards
            </span>
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl uppercase leading-tight text-black mb-6">
            Vote More.
            <br />
            <span className="bg-[#EAB308] border-2 border-black px-3 inline-block -rotate-1 shadow-neo-sm">
              Win More.
            </span>
          </h1>
          <p className="text-xl font-medium text-black/70 max-w-2xl mx-auto mb-10">
            Every vote you cast on Janamat earns on-chain points — and when
            friends you refer cast their first vote, you earn bonus points too.
            Hit a milestone and unlock physical merch and NFTs, shipped right to
            your door.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://janamat.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#EA580C] text-white font-display font-extrabold text-sm px-8 py-3 border-2 border-black shadow-neo neo-btn uppercase"
            >
              Start Voting on Janamat ↗
            </a>
            <Link
              href="/leaderboard"
              className="bg-white text-black font-display font-extrabold text-sm px-8 py-3 border-2 border-black shadow-neo neo-btn uppercase"
            >
              Check Your Points →
            </Link>
          </div>
        </div>
      </section>

      {/* Milestone path */}
      <section className="py-12 px-4 bg-white border-b-[3px] border-black overflow-x-auto">
        <div className="max-w-3xl mx-auto">
          <p className="font-display font-bold text-xs uppercase tracking-widest text-black/40 mb-8 text-center">
            Milestone Path
          </p>
          <div className="flex items-center justify-center min-w-max mx-auto gap-0">
            {milestones.map((m, i) => (
              <div key={m.pts} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{m.icon}</span>
                  <div
                    className={`w-12 h-12 border-[3px] border-black flex items-center justify-center font-display font-black text-sm shadow-neo-sm ${m.featured ? "bg-[#EA580C] text-white" : "bg-white text-black"}`}
                  >
                    {m.pts}
                  </div>
                  <span className="font-display font-bold text-[10px] uppercase text-black/50 max-w-[64px] text-center leading-tight">
                    {m.title.split(" ")[0]}
                  </span>
                </div>
                {i < milestones.length - 1 && (
                  <div className="w-16 md:w-24 h-[3px] bg-black mx-2 mt-[-20px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestone cards */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        <div>
          <h2 className="font-display font-extrabold text-2xl uppercase mb-8 flex items-center gap-2 text-black">
            <span>🎁</span> Reward Milestones
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((m) => (
              <div
                key={m.pts}
                className={`${m.cardBg} border-[3px] border-black p-7 shadow-neo-lg hover:-translate-y-1 transition-transform relative ${m.featured ? "ring-4 ring-[#EA580C] ring-offset-2" : ""}`}
              >
                {/* Tag */}
                <div
                  className={`absolute -top-3.5 left-5 ${m.tagBg} border-2 border-black px-3 py-0.5 font-display font-bold text-xs uppercase tracking-wider ${m.tagText} shadow-neo-sm`}
                >
                  {m.tag}
                </div>

                {/* Points badge */}
                <div
                  className={`${m.accentBg} border-2 border-black inline-flex items-center px-3 py-1 mb-5 shadow-neo-sm`}
                >
                  <span className={`font-display font-black text-lg ${m.accentText}`}>
                    {m.pts} PTS
                  </span>
                </div>

                <div className="text-4xl mb-3">{m.icon}</div>
                <h3 className="font-display font-extrabold text-xl uppercase text-black mb-1">
                  {m.title}
                </h3>
                <p className="font-mono text-xs font-bold text-black/50 mb-4 uppercase">
                  {m.subtitle}
                </p>
                <p className="text-sm font-medium text-black/70 leading-relaxed mb-6">
                  {m.desc}
                </p>

                <div className="border-t-2 border-black/10 pt-4 flex items-center justify-between">
                  <span className="font-display font-bold text-xs uppercase text-black/50">
                    Reward
                  </span>
                  <span className="font-display font-bold text-xs uppercase text-black bg-black/5 border border-black/20 px-2 py-0.5">
                    {m.reward}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to claim */}
        <div>
          <h2 className="font-display font-extrabold text-2xl uppercase mb-8 flex items-center gap-2 text-black">
            <span>📋</span> How to Claim
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Vote on Janamat",
                desc: "Every confirmed vote on janamat.app earns you on-chain engagement points, automatically recorded by the engage_registry program.",
                icon: "🗳️",
                bg: "bg-[#EA580C]",
              },
              {
                step: "02",
                title: "Hit a Milestone",
                desc: "Your points accumulate on-chain. Once you cross a milestone threshold, you become eligible to claim that tier's reward.",
                icon: "🎯",
                bg: "bg-[#EAB308]",
              },
              {
                step: "03",
                title: "Submit Your Claim",
                desc: "Join the Superteam Nepal Discord and post your wallet address in #rewards-claim. The team verifies your on-chain points and ships your reward.",
                icon: "📦",
                bg: "bg-[#0891B2]",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white border-[3px] border-black p-6 shadow-neo hover:-translate-y-1 transition-transform"
              >
                <div
                  className={`${s.bg} border-2 border-black inline-block px-2 py-0.5 font-mono font-bold text-xs mb-4 ${s.bg === "bg-[#EAB308]" ? "text-black" : "text-white"}`}
                >
                  STEP {s.step}
                </div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-display font-extrabold text-lg uppercase mb-2 text-black">
                  {s.title}
                </h3>
                <p className="text-sm text-black/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="https://discord.com/invite/7EyjSnwnu5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black text-white font-display font-extrabold text-sm px-8 py-3 border-2 border-black shadow-neo neo-btn uppercase"
            >
              Join Discord to Claim ↗
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display font-extrabold text-2xl uppercase mb-8 flex items-center gap-2 text-black">
            <span>❓</span> FAQ
          </h2>
          <FaqSection faqs={faqs} />
        </div>

        {/* Footer note */}
        <p className="text-center font-mono text-xs text-black/40 pb-4">
          Rewards verified against on-chain{" "}
          <code className="bg-[#EAB308] border border-black px-1 text-black">
            EngageProfile
          </code>{" "}
          PDAs ·{" "}
          <code className="bg-[#EAB308] border border-black px-1 text-black">
            engage_registry
          </code>{" "}
          program on Solana devnet
        </p>
      </div>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-[#EA580C] border-t-[3px] border-black text-center">
        <h2 className="font-display font-extrabold text-5xl uppercase text-white mb-4 leading-tight">
          Ready to earn your hoodie?
        </h2>
        <p className="text-lg font-medium text-white/80 mb-8 max-w-lg mx-auto">
          200 points. That&apos;s the target. Every vote and successful referral
          gets you closer.
        </p>
        <a
          href="https://janamat.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-black font-display font-extrabold text-sm px-10 py-4 border-2 border-black shadow-neo neo-btn uppercase"
        >
          Cast Your Vote Now ↗
        </a>
      </section>
    </main>
  );
}
