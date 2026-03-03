// Singleton Anchor program instance, PDA helpers, and low-level RPC utilities.

import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { readFileSync } from "fs";
import path from "path";

export const ENGAGE_PROGRAM_ID = new PublicKey(
  "6bY93DBKnAct89SGYhNLwEukNpHm6QQ4zbwANVoWL3X9",
);
const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyProgram = anchor.Program<any>;

// Shared singleton — reused across events to avoid stale blockhash errors.
let _program: AnyProgram | null = null;
let _authority: Keypair | null = null;
let _connection: Connection | null = null;

export function getProgram(): {
  program: AnyProgram;
  authority: Keypair;
  connection: Connection;
} {
  if (_program && _authority && _connection) {
    return { program: _program, authority: _authority, connection: _connection };
  }

  const keypairBytes = (() => {
    const json = process.env.AUTHORITY_KEYPAIR_JSON;
    if (json) {
      return Uint8Array.from(JSON.parse(json) as number[]);
    }
    const keypairPath =
      process.env.AUTHORITY_KEYPAIR_PATH ||
      `${process.env.HOME}/.config/solana/id.json`;
    return Uint8Array.from(
      JSON.parse(readFileSync(keypairPath, "utf8")) as number[],
    );
  })();
  const authority = Keypair.fromSecretKey(keypairBytes);

  const connection = new Connection(RPC_URL, "confirmed");
  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(authority),
    { commitment: "confirmed" },
  );

  const idl = JSON.parse(
    readFileSync(path.resolve("./engage_registry_idl.json"), "utf8"),
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const program: AnyProgram = new anchor.Program(idl as any, provider);

  _program = program;
  _authority = authority;
  _connection = connection;

  return { program, authority, connection };
}

// Reset singleton so the next call gets a fresh connection (used on retry).
export function resetProgram(): void {
  _program = null;
  _authority = null;
  _connection = null;
}

// PDA for the single GlobalState account.
export function globalStatePda(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("global_state")],
    ENGAGE_PROGRAM_ID,
  );
  return pda;
}

// PDA for a voter's EngageProfile account.
export function engageProfilePda(voter: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("engage_profile"), voter.toBuffer()],
    ENGAGE_PROGRAM_ID,
  );
  return pda;
}

// Per-voter async lock — prevents concurrent registerVoter races.
const voterLocks = new Map<string, Promise<void>>();

export function withVoterLock<T>(
  voterAddress: string,
  fn: () => Promise<T>,
): Promise<T> {
  const prev = voterLocks.get(voterAddress) ?? Promise.resolve();
  let resolve!: () => void;
  const next = new Promise<void>((r) => { resolve = r; });
  voterLocks.set(voterAddress, next);

  return prev.then(() => fn()).finally(() => {
    resolve();
    if (voterLocks.get(voterAddress) === next) voterLocks.delete(voterAddress);
  });
}

// Retries transient RPC failures with linear backoff, resetting singleton each time.
function isTransientRpcError(err: unknown): boolean {
  const msg = String((err as { message?: string })?.message ?? err);
  return (
    msg.includes("Unknown action") ||
    msg.includes("blockhash") ||
    msg.includes("timeout") ||
    msg.includes("503") ||
    msg.includes("429")
  );
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 4,
  baseDelayMs = 1500,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isTransientRpcError(err) || attempt === maxAttempts) throw err;
      const delay = baseDelayMs * attempt;
      console.log(`[engage] RPC error, retry ${attempt}/${maxAttempts} in ${delay}ms...`);
      resetProgram();
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}
