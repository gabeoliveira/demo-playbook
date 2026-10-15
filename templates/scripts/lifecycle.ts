/**
 * Generic demo lifecycle runner: provision and teardown as ordered stages.
 *
 * Platform-neutral. You supply `check` / `create` / `remove` per resource, and
 * this file supplies the discipline:
 *   - every created id is written back to .env (no "copy it from the console")
 *   - an id already in .env is trusted only after a liveness check
 *   - idempotent: re-running after a failure skips stages whose id is alive
 *   - teardown is a dry run unless --apply, and walks stages in reverse
 *   - kept-by-policy stages are never deleted (shared / slow to re-earn)
 *   - a stage can refuse deletion (e.g. "still attached to a live config")
 *
 * Usage: see provision.example.ts and teardown.example.ts.
 * Run with: npx tsx scripts/provision.ts
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export type Ctx = { env: Record<string, string>; dryRun: boolean };

export interface Stage {
  /** Human label, printed in logs. */
  name: string;
  /** .env key that holds this resource's id. Omit for stages with no id (deploy, seed). */
  envKey?: string;
  /** Return true if the id still refers to a live resource. */
  check?: (id: string, ctx: Ctx) => Promise<boolean>;
  /** Create the resource; return its id (or undefined for id-less stages). */
  create: (ctx: Ctx) => Promise<string | undefined>;
  /** Delete the resource during teardown. Omit = nothing to delete. */
  remove?: (id: string, ctx: Ctx) => Promise<void>;
  /** Never delete during teardown (shared, approval-gated, no delete API, ...). */
  keep?: string;
  /** Return a reason string to refuse deletion, or undefined to allow it. */
  guard?: (id: string, ctx: Ctx) => Promise<string | undefined>;
}

const ENV_PATH = process.env.ENV_FILE ?? '.env';

export function loadEnv(path = ENV_PATH): Record<string, string> {
  const env: Record<string, string> = {};
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return env;
}

/** Set or replace KEY=value in .env, preserving every other line and comment. */
export function writeEnv(key: string, value: string, path = ENV_PATH): void {
  const lines = existsSync(path) ? readFileSync(path, 'utf8').split('\n') : [];
  const idx = lines.findIndex((l) => l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/)?.[1] === key);
  const entry = `${key}=${value}`;
  if (idx >= 0) lines[idx] = entry;
  else {
    if (lines.length && lines[lines.length - 1] === '') lines.pop();
    lines.push(entry, '');
  }
  writeFileSync(path, lines.join('\n'));
}

/** Retry an async check, e.g. a health endpoint behind DNS that is still propagating. */
export async function retry<T>(
  fn: () => Promise<T>,
  { attempts = 10, delayMs = 15_000, label = 'operation' } = {},
): Promise<T> {
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      console.log(`  … ${label} not ready (attempt ${i}/${attempts})`);
      if (i < attempts) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

export async function provision(stages: Stage[], manualRemainder: string[] = []): Promise<void> {
  const ctx: Ctx = { env: loadEnv(), dryRun: false };

  for (const stage of stages) {
    const existing = stage.envKey ? ctx.env[stage.envKey] : undefined;

    if (existing && stage.check) {
      if (await stage.check(existing, ctx)) {
        console.log(`✓ ${stage.name}: alive (${existing}), skipping`);
        continue;
      }
      console.log(`! ${stage.name}: ${existing} in .env is stale, recreating`);
    }

    console.log(`→ ${stage.name}`);
    const id = await stage.create(ctx);
    if (stage.envKey && id) {
      writeEnv(stage.envKey, id);
      ctx.env[stage.envKey] = id; // later stages see it immediately
      console.log(`  wrote ${stage.envKey}=${id}`);
    }
  }

  console.log('\nProvisioned.');
  if (manualRemainder.length) {
    console.log('\nStill manual:');
    for (const step of manualRemainder) console.log(`  - [ ] ${step}`);
  }
}

export async function teardown(stages: Stage[], argv = process.argv.slice(2)): Promise<void> {
  const ctx: Ctx = { env: loadEnv(), dryRun: !argv.includes('--apply') };
  console.log(ctx.dryRun ? 'DRY RUN (pass --apply to execute)\n' : 'APPLYING\n');

  const followUps: string[] = [];

  // Reverse order: dependents go before what they depend on.
  for (const stage of [...stages].reverse()) {
    const id = stage.envKey ? ctx.env[stage.envKey] : undefined;
    if (!stage.remove || !id) continue;

    if (stage.keep) {
      console.log(`= keep   ${stage.name} (${id}): ${stage.keep}`);
      continue;
    }
    if (stage.check && !(await stage.check(id, ctx))) {
      console.log(`- gone   ${stage.name} (${id}): already deleted`);
      followUps.push(`blank ${stage.envKey} in .env`);
      continue;
    }
    const refusal = stage.guard ? await stage.guard(id, ctx) : undefined;
    if (refusal) {
      console.log(`✗ refuse ${stage.name} (${id}): ${refusal}`);
      continue;
    }

    if (ctx.dryRun) {
      console.log(`× would delete ${stage.name} (${id})`);
    } else {
      await stage.remove(id, ctx);
      console.log(`× deleted ${stage.name} (${id})`);
      followUps.push(`blank ${stage.envKey} in .env`);
    }
  }

  if (followUps.length) {
    console.log('\nFollow-ups:');
    for (const f of followUps) console.log(`  - [ ] ${f}`);
  }
  console.log('\nRebuild later with: npm run provision');
}
