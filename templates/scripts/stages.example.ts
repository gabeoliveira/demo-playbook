/**
 * Example stage list. Replace the API calls with your platform's endpoints
 * (see PRODUCT_MAP.md). The ORDER is the provisioning order; teardown walks it
 * in reverse.
 *
 * Shows the four patterns that matter:
 *   1. liveness check via GET (404 = stale)
 *   2. a shared resource re-pointed (and restored on teardown) instead of deleted
 *   3. a delete guard that refuses while something live still uses the resource
 *   4. keep-by-policy for approval-gated / shared things
 */
import type { Stage } from './lifecycle.js';
import { retry } from './lifecycle.js';

const BASE = process.env.PLATFORM_API_BASE ?? 'https://api.example.com/v1';
const AUTH = `Bearer ${process.env.PLATFORM_API_KEY ?? ''}`;

async function api(method: string, path: string, body?: unknown): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${await res.text()}`);
  return res.status === 204 ? undefined : res.json();
}

async function alive(path: string): Promise<boolean> {
  const res = await fetch(`${BASE}${path}`, { headers: { Authorization: AUTH } });
  return res.ok; // 404/410 → stale id
}

export const stages: Stage[] = [
  {
    name: 'Memory store',
    envKey: 'DEMO_MEMORY_ID',
    check: (id) => alive(`/memory-stores/${id}`),
    create: async () => {
      // Deleted names can stay reserved for a while, so suffix on conflict.
      for (const suffix of ['', '-2', '-3']) {
        try {
          return (await api('POST', '/memory-stores', { name: `demo-acme${suffix}` })).id;
        } catch (err) {
          if (!String(err).includes('409')) throw err;
        }
      }
      throw new Error('memory store name still reserved after retries');
    },
    remove: (id) => api('DELETE', `/memory-stores/${id}`),
    guard: async (id, ctx) => {
      const cfg = await api('GET', `/configs/${ctx.env.SHARED_CONFIG_ID}`);
      if (cfg.memoryStoreId !== id) return undefined;
      // In a dry run the restore stage only printed its plan, so don't report a false refusal.
      if (ctx.dryRun && ctx.env.RESTORE_CONFIG_STORE_ID) return undefined;
      return 'still attached to the shared config; restore the config first';
    },
  },
  {
    // Shared resource: we never create or delete it, we RE-POINT it, and record the previous value.
    name: 'Shared config → our memory store',
    envKey: 'RESTORE_CONFIG_STORE_ID',
    check: async (_prev, ctx) => {
      const cfg = await api('GET', `/configs/${ctx.env.SHARED_CONFIG_ID}`);
      return cfg.memoryStoreId === ctx.env.DEMO_MEMORY_ID;
    },
    create: async (ctx) => {
      const cfg = await api('GET', `/configs/${ctx.env.SHARED_CONFIG_ID}`);
      await api('PATCH', `/configs/${ctx.env.SHARED_CONFIG_ID}`, { memoryStoreId: ctx.env.DEMO_MEMORY_ID });
      console.log('  restart the app: the store id is read at boot');
      return cfg.memoryStoreId; // the previous store, so teardown can restore it
    },
    // "remove" = restore the previous value. Runs BEFORE the store's delete (reverse order).
    remove: (prev, ctx) => api('PATCH', `/configs/${ctx.env.SHARED_CONFIG_ID}`, { memoryStoreId: prev }),
  },
  {
    name: 'Knowledge base',
    envKey: 'DEMO_KB_ID',
    check: (id) => alive(`/knowledge-bases/${id}`),
    create: async () => {
      const kb = await api('POST', '/knowledge-bases', { name: 'demo-acme' });
      // ...upload ./knowledge/*.md here, then wait until every source is ready
      return kb.id;
    },
    remove: (id) => api('DELETE', `/knowledge-bases/${id}`),
  },
  {
    name: 'Voice CTA template (approval-gated)',
    envKey: 'DEMO_TEMPLATE_ID',
    check: (id) => alive(`/templates/${id}`),
    create: async () => (await api('POST', '/templates', { name: 'demo_acme_call_cta' })).id,
    remove: (id) => api('DELETE', `/templates/${id}`),
    keep: 'approved templates are lead time; delete only with --templates',
  },
  {
    name: 'Seed persona',
    create: async () => {
      // ...profile + dated past-tense history with source "acme-seed" + system-of-record rows
      return undefined;
    },
  },
  {
    name: 'Deploy + health check',
    create: async () => {
      // ...run your deploy CLI here (execSync), then wait out DNS propagation:
      await retry(
        async () => {
          const r = await fetch(`${process.env.APP_URL}/health`);
          if (!r.ok) throw new Error(String(r.status));
        },
        { label: 'health' },
      );
      return undefined;
    },
  },
];
