# How I work: demos and POCs for conversational AI

I'm a solutions engineer who builds customer-facing demos and POCs for conversational-AI agents
(voice, messaging, human handoff, post-conversation insights). My method is packaged as the
`demo-playbook` plugin. If it isn't installed, the source is at `~/demo-playbook/`.

## Which tool for which job

- **Demo** ("show it works") → `/build-demo`. The skill is `skills/build-demo/SKILL.md`.
- **Paid POC** ("prove it should exist", ends in Go/No-Go) → `/frame-poc`, 7-tab framework.
- **Feasibility spike** (a mechanism question to answer before proposing paid work) → `/frame-poc`,
  spike variant: README with the question and trade-off table, SETUP with transcripts, Q1–Qn pass/fail.
- **Design doc** ("how we'd build X") → neither. Just write the design.

## Platform knowledge

- Which product plays which role: `~/demo-playbook/PRODUCT_MAP.md`.
- Platform quirks: `PLATFORM_NOTES.md`, in the team demo repo or in `~/demo-playbook/`.
  Read it before touching the platform. When a new gotcha costs more than an hour, propose adding it.

## Non-negotiables (details in `reference/principles.md`)

1. **A demo is one story, not a feature catalog.** The arc is recognized customer → grounded
   answer → real action → continuity moment → insight close.
2. **Draft first.** I edit and reject. I don't author from blank. Propose a concrete 80% draft;
   ask only what only I know.
3. **A demo isn't done until a teammate can run it.** Every demo needs a sequence diagram, demo
   script, SETUP.md, recipe page, and the provision + teardown scripts.
4. **Every state reset is scripted.** Close open sessions first, then purge, then reseed. Rehearse
   at least 3× against a stopwatch.
5. **Additive only, and select by our own markers.** Never edit or delete what was on a platform
   before us: add our own, marked, and adapt our spec to theirs. Never select by "it uses my number
   or sender". Destructive bulk actions need an explicit, named target.
6. **Compliance is load-bearing.** Cite the customer's real regulator in the agent's constraints.
7. **A POC produces a decision.** Hypotheses are numbered, each product has one primary metric,
   and the scorecard is living. Disambiguate a brief's number before you reframe it.
8. **Audience decides language.** Internal material is in English. Customer-facing material is in
   the customer's language, using the real dialogue from smoke tests and never invented lines.
   That includes the agent's prompts, procedures and tool descriptions whenever the customer will
   see them, for example on a platform whose configuration is shown during the demo.

## Preferences

- TypeScript by default (Node 20+, `tsx`, native `fetch`, Express for webhooks). Python only when required.
- Mermaid diagrams must render. Validate with `@mermaid-js/mermaid-cli` before shipping.
- Push back before building something a guardrail rejects. State the rule, the reason and the
  corrected path, then defer if I override.
