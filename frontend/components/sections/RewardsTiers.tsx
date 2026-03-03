const tiers = [
  {
    icon: "✉️",
    name: "Sticker Pack",
    range: "100 pts",
    perks: [
      "Janamat & Superteam Nepal stickers",
      "Mailed to your address",
      "Leaderboard badge",
    ],
    bg: "bg-white",
    label: "100 PTS",
    labelBg: "bg-[#EAB308]",
    labelText: "text-black",
  },
  {
    icon: "🧥",
    name: "Superteam Nepal Hoodie",
    range: "200 pts",
    perks: [
      "Superteam Nepal hoodie",
      "Most coveted reward",
      "Only top voters earn this",
    ],
    bg: "bg-[#EA580C]",
    label: "200 PTS",
    labelBg: "bg-black",
    labelText: "text-white",
  },
  {
    icon: "🏅",
    name: "On-Chain Civic NFT",
    range: "500 pts",
    perks: [
      "Soulbound NFT on Solana",
      "Permanent on-chain badge",
      "Coming soon",
    ],
    bg: "bg-[#0891B2]",
    label: "500 PTS",
    labelBg: "bg-white",
    labelText: "text-black",
  },
];

export function RewardsTiers() {
  return (
    <section className="py-24 px-4 bg-[#FFFBEB] border-t-[3px] border-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-[#EA580C] border-2 border-black px-3 py-1 shadow-neo-sm -rotate-1 mb-6">
            <span className="font-display font-bold text-xs uppercase tracking-widest text-white">
              Reward Tiers
            </span>
          </div>
          <h2 className="font-display font-extrabold text-5xl uppercase leading-tight text-black">
            Your Engagement,{" "}
            <span className="bg-black text-white px-2">Rewarded.</span>
          </h2>
          <p className="mt-4 text-xl font-medium max-w-xl mx-auto text-black/70">
            Points unlock real physical and on-chain rewards.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`${tier.bg} border-[3px] border-black p-7 shadow-neo-lg hover:-translate-y-1 transition-transform relative`}
            >
              {/* Label tag */}
              <div
                className={`absolute -top-3 right-4 ${tier.labelBg} border-2 border-black px-2 py-0.5 font-display font-bold text-xs uppercase ${tier.labelText} shadow-neo-sm`}
              >
                {tier.label}
              </div>

              <div className="text-3xl mb-4">{tier.icon}</div>
              <h3
                className={`font-display font-extrabold text-xl uppercase mb-1 ${tier.bg === "bg-[#EA580C]" || tier.bg === "bg-[#0891B2]" ? "text-white" : "text-black"}`}
              >
                {tier.name}
              </h3>
              <p
                className={`font-mono font-bold text-xs mb-5 ${tier.bg === "bg-[#EA580C]" || tier.bg === "bg-[#0891B2]" ? "text-white/60" : "text-black/60"}`}
              >
                {tier.range}
              </p>
              <ul className="space-y-2">
                {tier.perks.map((p) => (
                  <li
                    key={p}
                    className={`flex items-start gap-2 text-sm font-medium ${tier.bg === "bg-[#EA580C]" || tier.bg === "bg-[#0891B2]" ? "text-white/80" : "text-black/80"}`}
                  >
                    <span
                      className={`mt-0.5 font-bold ${tier.bg === "bg-[#EA580C]" || tier.bg === "bg-[#0891B2]" ? "text-white" : "text-black"}`}
                    >
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/rewards"
            className="inline-block bg-black text-white font-display font-extrabold text-sm px-8 py-3 border-2 border-black shadow-neo neo-btn uppercase"
          >
            View Full Rewards Page →
          </a>
        </div>
      </div>
    </section>
  );
}
