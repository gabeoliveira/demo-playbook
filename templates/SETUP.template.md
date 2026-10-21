# <<Demo name>>: setup guide

Ordered, checkbox steps from an empty checkout to a fully rehearsable demo. Written for a
teammate who is comfortable in a terminal but **not** fluent in the code. You should never need
to read the source to follow it.

**Time estimate:** ~<<4–6>> h the first time, ~1 h on a rebuild.

## Contents

1. Prerequisites
2. Local environment
3. One-time console setup
4. Provisioning
5. Handoff wiring
6. Deploy
7. Webhooks and channels
8. Smoke test
9. Rehearsal and reset
10. Common issues
11. Teardown

---

## 1. Prerequisites

- [ ] <<Platform account>>, with a **scoped API key** (not the master credential).
- [ ] <<Channel senders / numbers>> (sandbox is fine for rehearsal).
- [ ] <<LLM key, if the platform doesn't host the model>>.
- [ ] <<Hosting account + CLI>> · <<tunnel tool for local dev>> · Node 20+.

## 2. Local environment

```bash
cp .env.example .env
npm install
```

Every variable, and where its value comes from:

| Variable | What it is | Comes from |
|---|---|---|
| `<<PLATFORM_API_KEY>>` | API key | Console → <<path>> (by hand) |
| `<<DEMO_KB_ID>>` | Knowledge base id | `npm run provision` (script fills it) |
| `PERSONA_PHONE` | Test persona's phone | You (E.164) |
| … | | |

- [ ] Sanity check: `<<one-liner that proves creds work, e.g. a curl that lists something>>`

## 3. One-time console setup

- [ ] <<Anything that can't be scripted: exact clicks, and what "done" looks like>>

## 4. Provisioning (ORDER MATTERS)

**One command:** `npm run provision`. It runs the steps below in order, verifies each existing id is
still alive before trusting it, **writes every new id into `.env`**, deploys, and prints what's
left to do by hand. If it fails, re-run it; completed steps skip themselves.

The manual sequence, so you know what it did:

```bash
npm run create-memory    # → <<MEMORY_ID>> written to .env
npm run create-kb        # → <<DEMO_KB_ID>> written to .env (wait until all sources are ready)
npm run create-table     # → <<TABLE_ID>> written to .env
npm run seed             # persona profile + history + system-of-record rows
```

<<Any attach/re-point step the runtime depends on, plus "restart the app after this".>>

## 5. Handoff wiring

- [ ] <<Human-desk setup: queue, routing, context panel>>
- [ ] Smoke test: `<<curl that triggers a handoff>>` → expect <<result>>.

## 6. Deploy

- [ ] Region: **<<region>>**, because <<it's next to the voice infrastructure>>.
- [ ] `<<deploy commands>>`. Every `.env` variable is set as a secret.

## 7. Webhooks and channels

- [ ] <<Channel>> → `https://<<app>>/<<path>>` (POST)
- [ ] …

## 8. Smoke test (the real journey, with expected results)

1. [ ] Send `<<first message>>` → expect: greeted as <<Name>>, references <<prior interaction>>.
2. [ ] Ask `<<factual question>>` → expect: <<figures verbatim>>.
3. [ ] `<<action request>>` → confirm → expect: <<row field = value>> and a memory observation with
       source `<<brand>>-<<flow>>`.
4. [ ] Switch channel → expect: the first turn references step 3 unprompted.
5. [ ] End, wait ~<<n>> s → expect: <<insights fields populated>>.

## 9. Rehearsal and reset

```bash
npm run reset   # 1. close open sessions  2. purge runtime memory  3. reseed
```

- [ ] Rehearse at least 3× against a stopwatch, with `npm run reset` between runs.
- [ ] Run a seed-safe sweep right **before** each rehearsal, because memory extraction can land
      minutes after a session closes.

## 10. Common issues

| Symptom | Likely cause | Fix |
|---|---|---|
| Agent doesn't recognize the persona | Seed didn't run, or the caller id ≠ `PERSONA_PHONE` | `npm run seed`; check the number |
| Agent greets the customer as **someone else's persona** | Runtime reads the store attached to a shared config, not your env var | Re-point the config, restart the app |
| Next run fails with a "conversation already exists / locked" error | The previous session was left open or inactive (handoff does this) | `npm run reset` (it closes sessions first) |
| Knowledge answer is vague or wrong | Sources not finished ingesting, or top-k too high | Check ingestion status; top-k 3–5 |
| Voice drops at a fixed N seconds | Timeout on a provider leg, not the app | Read the call's event timeline first |
| Deploy fails on a resource cap | Account-limited resources left standing | `npm run teardown -- --apply` on finished demos |
| Diagram won't render | Spaced participant name on a message line | Use space-free ids with aliases |
| <<from PLATFORM_NOTES>> | | |

## 11. Teardown (after demo day)

```bash
npm run teardown              # dry run: prints the plan, touches nothing
npm run teardown -- --apply   # executes it
```

- [ ] **Deletes:** <<account-limited resources>>.
- [ ] **Keeps by policy:** <<shared configs, approved templates, scoring operators>>.
- [ ] **Manual follow-ups it prints:** <<…>>. Then blank the deleted ids in `.env`.
- [ ] Rebuild later with `npm run provision` (~30 min).
