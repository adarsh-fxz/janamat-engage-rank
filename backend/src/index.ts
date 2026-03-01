// Express server — API routes, startup initialization, Solana listener.

import "dotenv/config";
import express from "express";
import cors from "cors";
import { startSolanaListener } from "./solanaListener.js";
import { initializeIfNeeded } from "./engageService.js";
import { getOnChainLeaderboard, getGlobalStats, getVoterProfile } from "./queries.js";
import { recordReferral, getReferralStats, getReferredBy } from "./referralService.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/leaderboard", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    res.json(await getOnChainLeaderboard(limit));
  } catch (err) {
    console.error("[api] /leaderboard error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

app.get("/stats", async (_req, res) => {
  try {
    const stats = await getGlobalStats();
    if (!stats) { res.status(404).json({ error: "GlobalState not found on-chain" }); return; }
    res.json(stats);
  } catch (err) {
    console.error("[api] /stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Returns on-chain profile + referral stats merged.
app.get("/profile/:address", async (req, res) => {
  try {
    const profile = await getVoterProfile(req.params.address);
    if (!profile) { res.status(404).json({ error: "Voter profile not found" }); return; }
    res.json({
      ...profile,
      referralStats: getReferralStats(req.params.address),
      referredBy: getReferredBy(req.params.address),
    });
  } catch (err) {
    console.error("[api] /profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Called by janamat.app after a new user signs in to record the referral link.
app.post("/referral/register", async (req, res) => {
  try {
    const { referee, referrer } = req.body as { referee?: string; referrer?: string };
    if (!referee || !referrer) {
      res.status(400).json({ error: "referee and referrer are required" });
      return;
    }
    const result = recordReferral(referee, referrer);
    if (!result.ok) { res.status(400).json({ error: result.reason }); return; }
    res.json({ success: true, message: result.message });
  } catch (err) {
    console.error("[api] /referral/register error:", err);
    res.status(500).json({ error: "Failed to process referral" });
  }
});

app.get("/referral/stats/:wallet", (req, res) => {
  try {
    res.json(getReferralStats(req.params.wallet));
  } catch (err) {
    console.error("[api] /referral/stats error:", err);
    res.status(500).json({ error: "Failed to fetch referral stats" });
  }
});

app.get("/referral/by/:wallet", (req, res) => {
  try {
    res.json({ referredBy: getReferredBy(req.params.wallet) });
  } catch (err) {
    console.error("[api] /referral/by error:", err);
    res.status(500).json({ error: "Failed to fetch referral info" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  await initializeIfNeeded();
  startSolanaListener();
});
