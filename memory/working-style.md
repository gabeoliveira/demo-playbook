# Working style: seed for a fresh Claude memory

Ask Claude to read this file and save each item as its own memory. Each item gives the fact, why
it matters, and how to apply it.

## Who I am (type: user)

A solutions engineer who builds customer-facing demos and POCs for conversational-AI agents
across voice, messaging, human handoff and post-conversation insights. Comfortable with APIs,
webhooks, identity/SSO, contact-center concepts and LLM tooling. Skip the 101 explanations and lead
with the concrete mapping or config. When the customer's environment is unknown, ask before
guessing: I'm often the bridge between the platform docs and the customer's reality.

## Preferences (type: feedback)

- **TypeScript by default** for scripts, harnesses and POCs (Node 20+, `tsx`, native `fetch`,
  Express for webhook receivers).
  *Why:* it's the language I read and maintain most fluently.
  *How to apply:* use Python only when the task requires it or I ask.
- **Draft first.** Hand me an 80% draft to edit and reject. Don't hand me a questionnaire.
  *Why:* blank pages are where the time goes.
  *How to apply:* ask only what only I know, then propose.
- **Push back** when a request trips a principle. State the rule, the reason and the corrected
  path, then defer if I override.
  *Why:* each rule came from a real correction, and silent compliance repeats the mistake.
- **A demo isn't done without SETUP.md and the provision/teardown scripts.**
  *Why:* a demo that only its author can run isn't reusable.
  *How to apply:* SETUP.md is written for a teammate who isn't fluent in the code, and every
  `.env` id says where it comes from.
- **Internal material is in English; customer-facing material is in the customer's language,
  using real smoke-test dialogue.**
  *Why:* the audience decides the language.
- **Mermaid must render.** Use space-free participant ids, and validate with mermaid-cli before
  shipping.
  *Why:* an unrendered diagram is not a deliverable.
- **Publish finished write-ups as artifacts** (or `docs/*.html`) when they're meant for other
  people.

## Hard-won lessons (type: feedback)

- **Shared-environment cleanup selects by OUR markers** (our ids, webhooks, source tags), never by
  "uses my sender or number".
  *Why:* a reset once closed dozens of other teams' conversations, and closed was final.
  *How to apply:* destructive bulk actions need an explicit, named target. Record the previous
  state before touching a shared config, so teardown can restore it.
- **The runtime reads what's attached to a shared config, not the env var I set.**
  *Why:* the agent once greeted a customer as another demo's persona.
  *How to apply:* re-point the config and restart the app. Verify; don't assume.
- **Reset is close sessions → purge runtime memory → reseed**, and a seed-safe sweep runs right
  before each rehearsal.
  *Why:* open sessions lock the next run, memory merges runtime writes into seeds, and extraction
  lags by minutes.
- **Memory observations are past tense and dated**, with a `{brand}-{flow}` source tag.
  *Why:* pending-state wording ("awaiting call") goes stale and misleads the agent later.
- **Read the wire before theorizing**: socket frames, per-leg event timelines, per-step workflow
  context. Reproduce outside the abstraction.
  *Why:* every multi-hour debug session ended there.
- **POC briefs: disambiguate a number before reframing it.** "% handled 100% by AI" describes a
  metric; it doesn't target 100%.
  *Why:* I once wrote a whole "reject 100%" narrative that had to be walked back.
