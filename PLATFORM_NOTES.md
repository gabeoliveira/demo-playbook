# Platform notes: Decagon

The gotchas file. **Rule: if something cost more than an hour, it goes here the same day.**
Entries are ordered by severity and follow the template in `templates/PLATFORM_NOTES.template.md`.
Started 2026-10-22 from the Banco Galicia demo build. "Live" means seen on a real Decagon
instance; "docs" means read in docs.decagon.ai or the team's Agent Builder Lessons, not yet
reproduced by us.

Product names follow the Decagon brand guide: Agent Operating Procedures (AOPs), Duet, Duet
Autopilot, Watchtower, Guidelines, Guardrails, Knowledge, Simulations, Agent Versioning, User
Memory, Outbound Voice, Insights, Trace View. Say "AI agent", never "chatbot".

---

## Entries

### 1. Guidelines V2 workspaces reject the public guideline API (409)

**Symptom:** `POST /brand_guidelines/create` → 409 "Branch '…' already contains V2 guideline files;
cannot add V1 guidelines on a V2 branch. Use the V2 guidelines endpoints instead."
**Cause:** the instance uses Guidelines V2 (channel tabs → groups → guidelines). The public API
only documents the V1 create endpoint; no V2 endpoint is published.
**Fix:** build guidelines with Duet or in Build > Guidelines from a spec file. V2 guidelines live
in one channel tab, so a rule for chat and voice is two guidelines. Budget against the
**30-guidelines-per-workspace** limit (merge related rules into one guideline each).
**Verified:** 2026-10-22, live · **Scope:** any instance on Guidelines V2.

### 1b. Duet's apply saves AOP content, not AOP-level settings

**Symptom:** Duet reports a proposal "applied" (`status: applied`, `resource_changed: true`), the
text changes land, but allow conditions, block conditions, AOP visibility and Force AOP selection
stay empty. On our instance, every Duet-built AOP had null entry conditions.
**Cause:** the proposal-apply path (dashboard and `duet-cli`) persists the AOP body; those four
fields are AOP-level settings it doesn't write. In AOP V4, visibility and forcing are Python
expressions on metadata (`metadata._decagon_channel == "voice"`), not a channels block.
**Fix:** after every Duet-built AOP, paste those fields in the AOP editor/settings from the spec
(keep a per-AOP checklist), then verify through a fresh Duet read. The good news: apply also
leaves those fields untouched, so later Duet edits don't wipe what you set by hand (verified: entry
conditions and channel toggles survived a Duet apply on 2026-10-23). In the UI they live in the
AOP's ⋯ menu: **Channel visibility >** (toggles) and **Experiment & AOP selection** (When to use,
When not to use, Force AOP selection). Guardrail actions aren't shown in
Duet's listing either: check them in Build > Guardrails.
**Verified:** 2026-10-23, live (dashboard and `duet-cli ask`).

### 1b-2. Duet-created guardrails have no action, and the form may not save one

**Symptom:** guardrails Duet created have the right name, trigger and condition, but `playbook_id`
and `playbook_tool_id` are empty, so they detect and do nothing. Fixing the action in the dashboard
form wouldn't save.
**Fix:** `PATCH /guardrails/escalation_intent` with `intent_id`, `branch` and `playbook_id` (the
target AOP's `pb_…` id) works and reads back correctly (`scripts/fix-guardrail-actions.ts` in the
Galicia demo). `trigger_type: agent_output_with_regeneration` is accepted but reads back as
`agent_output`, so confirm the regeneration setting in the UI. Also note: Duet's first guardrail read
looked at `main`/production and reported "none"; name the branch explicitly.
**Verified:** 2026-10-23, live.

### 1c. AOP and guardrail names must be ASCII, too

**Symptom:** Duet stops: "the platform rejects accented characters in … names".
**Fix:** unaccented names ("Atencion personalizada", "Credito hipotecario"); conditions and body text
keep their accents. Reference other AOPs by their live, unaccented names.
**Verified:** 2026-10-23, live.

### 1d. Driving Duet from a coding agent: `duet-cli`

`duet-cli ask` (+ `--conversation-id`, `--file`) works for builds, edits and audits, and the
conversations show up in the dashboard. Gotchas: the active team can reset between calls (run
`duet-cli set-team` in the same command as a new `ask`); `--thinking-effort extended` can run past 10
minutes; Duet reads a tool's *declared* output schema, which can drift from what the code returns
(run the tool to check); a re-read right after a create can be stale. Verify every change in a
**fresh** conversation, not the one that made it.

More, from a full build session (2026-10-23):
- **The active team clears after every new (non-continued) conversation.** The next fresh `ask`
  fails, sometimes silently with no output. Always run `duet-cli set-team "<team>" && duet-cli ask …`.
- **Close stdin** (`< /dev/null`) and pipe through `tee`; background runs redirected to a file died
  with exit 137 and no output.
- **Long prompts: use `--file` with a `.md` file.** A long prompt passed as one argument returned
  nothing or died with exit 137. A `.txt` attachment arrives empty ("the attachment seems not to
  have uploaded"); the same text as `.md` works. Smoke-test a new file: ask Duet to quote one line.
- **Duet may stop at a proposal or hand work to async subagents.** The turn returns with "seeding
  the artifact…" or "fanning out subagents…" and nothing applied. Resume with `--conversation-id`
  ("finish it and apply"), then verify in a fresh thread.
- **A long `ask` can hang after Duet's turn is done.** No new output for 40 minutes, process still
  open. Kill it and resume the thread with a status question: the edits had landed. Wrap long
  applies in a background run and check the tee'd file instead of waiting on the process.
- **Quote-escape prompts.** Backticks inside a double-quoted `ask "…"` run as shell commands; use a
  `.md` file or single quotes.
- **Duet's flat AOP view shows template variables as plain `metadata.nombre`.** The stored node is
  a structured `metadata` node that renders at runtime. Ask for the raw node before "fixing" it.
- **Simulations use mocked tool outputs.** When you add a field to a tool, update every sim mock of
  that tool too, or criteria that depend on it can't pass.
- **Name the branch on every read.** Fresh threads default to `main`/production and report "no
  such AOP/guardrail"; say "pass branch = '<workspace>' to every read".
- **Simulations run async on Decagon's side** (3 concurrent generations max): the CLI turn returns
  while observers run; resume with `--conversation-id` and ask for status.
**Verified:** 2026-10-23, live.

### 2. Decagon-managed guidelines can contradict yours

**Symptom:** Duet's pre-check finds direct conflicts: a managed "respond in the language the
customer used" rule vs "always reply in Spanish"; a protected `public_rules` entry forcing
"$85,810,000.00" (comma thousands, two decimals) vs a local-format rule.
**Cause:** managed and `public_rules` guidelines ship with the instance and are protected.
**Fix:** ask Duet for conflicts with managed guidelines (quote both texts) before adding yours, and
adapt yours. Where a managed rule breaks the customer's locale (number format), ask the instance
owner to customize it; record its current text first so teardown can restore it.
**Verified:** 2026-10-22, live · **Scope:** every instance with managed guidelines.

### 3. Watchtowers are capped per instance, and pre-existing ones count

**Symptom:** `POST /watchtower/job` → 400 "You have reached the maximum number of Watchtowers".
**Cause:** per-instance cap (4 on the instance we used: 1 pre-existing + 3 of ours).
**Fix:** inventory the count first; mark yours required/optional; the cap can be raised by the
instance admin or the Decagon team. Never delete someone else's to make room.
**Verified:** 2026-10-22, live · **Scope:** all instances; cap value varies.

### 4. Watchtower list and create use different name fields

**Symptom:** `TypeError: Cannot read properties of undefined (reading 'startsWith')` in a script
that filters `GET /watchtower/all` by `job_name`.
**Cause:** the list returns `jobs[].name`; the create body takes `job_name`.
**Fix:** read `name` from the list, write `job_name` on create.
**Verified:** 2026-10-22, live.

### 5. Git-backed Agent Versioning: the workspace must exist before you write to it

**Symptom:** a write with `branch` → 500 "422 Client Error … No commit found for SHA:
heads/Staging" (from the instance's GitHub repo).
**Cause:** the branch named in the call (or the default the platform picked) doesn't exist in the
instance's repo; a new instance may have no Staging branch.
**Fix:** create the workspace in Agent Versioning first, then pass its exact name.
**Verified:** 2026-10-22, live.

### 6. Guideline names have a strict character set

**Symptom:** 400 "Invalid guidelines name. Only alphanumeric, spaces, underscores, dots, and
-()[]:&'+, are allowed."
**Cause:** a "·" separator in our name prefix; accented letters are probably rejected too.
**Fix:** ASCII-only names and prefixes (e.g. `GAL:`), "normativa" instead of "regulación". Validate
locally before the first write.
**Verified:** 2026-10-22, live (V1 endpoint; V2 UI names untested).

### 7. Outbound Voice campaigns (Missions API) reach US recipients only

**Symptom:** a callback to a non-US number can't be placed through `POST /mission_user/external/batch`.
**Cause:** `recipient_country_code`: "Only US is currently supported."
**Fix:** ring a US test phone held by the presenter and say so on stage. Carry the chat context in
the call's `metadata` (all values strings).
**Verified:** docs, 2026-10-22.

### 8. Agent-output guardrails don't run with chat streaming on

**Fix:** ask the Decagon team to turn streaming off for any chat flow that relies on an output
guardrail (e.g. "never say the loan is approved"). Lead time: one request.
**Verified:** docs.

### 9. User Memory can't be purged by an admin API

**Symptom:** a rehearsal reset can't clear what the agent "remembers".
**Cause:** `Conversation.clear_memory()` exists only inside tools; memory also needs an
authenticated user, and chat and voice use different `user_id`s unless mapped.
**Fix:** for demos, keep the persona's history in the simulated system of record and carry
cross-channel context in call metadata. Say on the recipe page that production uses User Memory.
**Verified:** docs.

### 10. Action Trackers: create them before the tools, and they aren't versioned

**Cause:** the metric name is derived from the display name (lowercase, non-alphanumerics → `_`)
and can't be edited; emissions from every branch, including Simulations, count together.
**Fix:** pick display names that produce the metric names your code emits; on shared instances,
gate `Conversation.emit_action` on `_decagon_branch_name`. Whether Duet can create tracker
definitions isn't documented: try it, fall back to Analyze > Action trackers.
**Verified:** docs + Lessons DB.

### 11. Duet reads only the Vault's own `AGENTS.md`

**Symptom:** Duet cites "user/00-AGENTS.md" when asked for its standing rules.
**Cause:** the content was saved as a separate Vault file, not in the team's `AGENTS.md`.
**Fix:** paste the standing instructions into the file named exactly `AGENTS.md`, then ask Duet
to summarize its rules in a fresh session.
**Verified:** 2026-10-22, live.

### 12. Duet loses the spec between turns

**Symptom:** asked what it added "not verbatim from the spec", Duet listed spec text as its own,
and its build had introduced a typo ("NUnca digás").
**Cause:** the pasted spec scrolled out of Duet's context in a long thread.
**Fix:** re-paste the spec in the review prompt, and diff Duet's output against the repo file
yourself before applying.
**Verified:** 2026-10-22, live.

### 13. Duet in Simulations over-mocks, writes booleans as strings

**Fix:** tell it to mock only calls to external systems; coerce types in tool code
(`as_bool`, `as_int`). Attachments accept PDF and images only: paste specs as text.
**Verified:** Lessons DB + docs.

### 14. Spanish (non-English) voice reads figures badly

**Fix:** every tool whose output reaches a voice turn returns `*_texto_voz` fields (amounts in
words with the currency named, dates as speech), including profile lookups.
**Verified:** Lessons DB (Spanish banking agent, Mexico) + 2026-10-22 build.

### 15. Recurring Watchtowers skip the last 24 h

**Fix:** for a same-day insight close, create one-time copies over the rehearsal window, or
rehearse at least a day ahead.
**Verified:** docs.

### 16. Smaller notes (docs, not yet reproduced)

- Knowledge articles over 2,200 characters are accepted with a warning; hard max 3,000.
- Tool output is truncated to 2,000 tokens; tool code times out at 60 s; set `timeout=` on requests.
- AOP V4 follows numbered steps with transition words better than bullets; reference metadata as
  "the value of the field X is {{metadata.X}}".
- A tool's description overrides AOP prompting for preambles.
- The Watchtower API's `filters` is a JSON-encoded string; `"{}"` worked as "no filter" on our
  instance.

---

## Starter checklist answers for Decagon

- **Account-limited:** Watchtowers (per instance), guidelines (30 per workspace), outbound numbers
  (provisioned by Decagon).
- **Approval-gated / lead time:** outbound voice enablement and number, chat streaming off,
  SMS A2P registration (1–3 weeks).
- **Reset:** close conversations with `POST /conversation/close` (select by our own recorded ids);
  memory as in entry 9.
- **Event timeline:** audit log and Trace View per conversation.
