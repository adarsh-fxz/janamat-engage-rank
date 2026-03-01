import Link from "next/link";
import { ReferralHandler } from "./ReferralHandler";

export const metadata = {
  title: "You've been referred | Janamat Engage Ranking",
  description: "Someone shared their Janamat Engage referral link with you.",
};

export default async function ReferPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const referrer = ref ?? "";

  return (
    <main className="min-h-screen bg-[#FEFCE8] bg-grid">
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Hero card */}
          <div className="bg-[#EAB308] border-[3px] border-black p-8 shadow-neo-lg text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="font-display font-black text-4xl uppercase text-black leading-tight mb-3">
              You&apos;ve been invited!
            </h1>
            <p className="font-medium text-black/70 text-lg">
              Someone thinks you should have a voice in Nepal&apos;s civic
              future. Vote on Janamat and earn on-chain points.
            </p>
          </div>

          {/* Referral status */}
          {referrer && <ReferralHandler referrer={referrer} />}

          {/* Referrer info */}
          {referrer && (
            <div className="border-[3px] border-black bg-white p-5 shadow-neo-sm">
              <p className="font-display font-bold text-xs uppercase text-black/40 mb-1">
                Referred by
              </p>
              <p className="font-mono font-bold text-sm text-black break-all">
                {referrer}
              </p>
              <a
                href={`https://explorer.solana.com/address/${referrer}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-display font-bold text-xs text-[#EA580C] border border-[#EA580C] px-2 py-1 uppercase"
              >
                View on Solana Explorer ↗
              </a>
            </div>
          )}

          {/* CTA */}
          <div className="space-y-3">
            <a
              href="https://janamat.app"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[#EA580C] text-white font-display font-extrabold text-sm px-8 py-4 border-2 border-black shadow-neo neo-btn uppercase"
            >
              Cast Your First Vote on Janamat ↗
            </a>
            <Link
              href="/leaderboard"
              className="block w-full text-center bg-white text-black font-display font-extrabold text-sm px-8 py-3 border-2 border-black shadow-neo neo-btn uppercase"
            >
              View Leaderboard →
            </Link>
            <Link
              href="/rewards"
              className="block w-full text-center bg-[#FFFBEB] text-black font-display font-bold text-sm px-8 py-3 border-2 border-black uppercase"
            >
              See What You Can Win →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
