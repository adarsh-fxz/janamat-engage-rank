import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { HowItWorksPreview } from "@/components/sections/HowItWorksPreview";
import { LeaderboardPreview } from "@/components/sections/LeaderboardPreview";
import { RewardsTiers } from "@/components/sections/RewardsTiers";
import { CTA } from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <div className="bg-grid">
      <Hero />
      <StatsBar />
      <HowItWorksPreview />
      <LeaderboardPreview />
      <RewardsTiers />
      <CTA />
    </div>
  );
}
