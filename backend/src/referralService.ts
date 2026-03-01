// Referral tracking: record links, enforce daily cap, award points on first vote.

import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { PublicKey } from "@solana/web3.js";
import { awardEngagePoints } from "./engageService.js";

const REFERRALS_PATH = path.resolve("./referrals.json");
const DAILY_CAP_PATH = path.resolve("./referral_daily.json");
const AWARDED_PATH = path.resolve("./referral_awarded.json");

const MAX_REFERRAL_POINTS_PER_DAY = 2;

function loadJson(filePath: string): Record<string, string | number> {
  if (!existsSync(filePath)) return {};
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function saveJson(filePath: string, data: object): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function loadReferrals(): Record<string, string> {
  return loadJson(REFERRALS_PATH) as Record<string, string>;
}

function loadDailyCounts(): Record<string, number> {
  return loadJson(DAILY_CAP_PATH) as Record<string, number>;
}

function loadAwarded(): Record<string, boolean> {
  return loadJson(AWARDED_PATH) as unknown as Record<string, boolean>;
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function dailyKey(referrer: string): string {
  return `${referrer}:${todayUtc()}`;
}

function isValidPubkey(addr: string): boolean {
  try {
    new PublicKey(addr);
    return true;
  } catch {
    return false;
  }
}

export type ReferralResult =
  | { ok: true; message: string }
  | { ok: false; reason: string };

export function recordReferral(
  referee: string,
  referrer: string,
): ReferralResult {
  if (!isValidPubkey(referee) || !isValidPubkey(referrer)) {
    return { ok: false, reason: "Invalid wallet address" };
  }
  if (referee === referrer) {
    return { ok: false, reason: "Cannot refer yourself" };
  }

  const referrals = loadReferrals();

  if (referrals[referee]) {
    return {
      ok: false,
      reason:
        referrals[referee] === referrer
          ? "Already attributed to you"
          : "Referee already attributed to another referrer",
    };
  }

  referrals[referee] = referrer;
  saveJson(REFERRALS_PATH, referrals);

  console.log(
    `[referral] recorded: ${referee.slice(0, 8)}... referred by ${referrer.slice(0, 8)}... (pending first vote)`,
  );

  return { ok: true, message: "Referral link saved. Point awarded after first vote." };
}

export async function maybeAwardReferral(referee: string): Promise<void> {
  const referrals = loadReferrals();
  const referrer = referrals[referee];

  if (!referrer) return;

  const awarded = loadAwarded();
  if (awarded[referee]) return;

  const daily = loadDailyCounts();
  const key = dailyKey(referrer);
  const todayCount = (daily[key] as number) ?? 0;

  if (todayCount >= MAX_REFERRAL_POINTS_PER_DAY) {
    console.log(
      `[referral] daily cap reached for referrer=${referrer.slice(0, 8)}..., skipping`,
    );
    return;
  }

  awarded[referee] = true;
  saveJson(AWARDED_PATH, awarded);

  daily[key] = todayCount + 1;
  saveJson(DAILY_CAP_PATH, daily);

  console.log(
    `[referral] first vote! awarding 1 pt to referrer=${referrer.slice(0, 8)}... for referee=${referee.slice(0, 8)}...`,
  );

  const syntheticSig = `referral:${referee}`.slice(0, 88);
  await awardEngagePoints(referrer, 0, syntheticSig, "referral");
}

export function getReferralStats(wallet: string): {
  totalReferrals: number;
  pendingReferrals: number;
  awardedReferrals: number;
  todayReferrals: number;
  referralsMade: string[];
} {
  const referrals = loadReferrals();
  const awarded = loadAwarded();
  const daily = loadDailyCounts();

  const referralsMade = Object.entries(referrals)
    .filter(([, ref]) => ref === wallet)
    .map(([referee]) => referee);

  const awardedReferrals = referralsMade.filter((r) => awarded[r]).length;
  const pendingReferrals = referralsMade.length - awardedReferrals;
  const todayReferrals = (daily[dailyKey(wallet)] as number) ?? 0;

  return {
    totalReferrals: referralsMade.length,
    pendingReferrals,
    awardedReferrals,
    todayReferrals,
    referralsMade,
  };
}

export function getReferredBy(wallet: string): string | null {
  return loadReferrals()[wallet] ?? null;
}
