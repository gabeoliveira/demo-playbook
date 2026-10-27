---
name: build-demo
description: "Build a conversational-AI customer demo the proven way. Fit the customer's use case into the one-story arc (recognized customer → grounded answer → real action → continuity moment → insight close), drive the build draft-first (propose, don't interrogate), and ship the deliverables that make it runnable by a teammate and rebuildable in ~30 min. Those are a sequence diagram, demo script, SETUP.md, customer recipe page, and provision/teardown scripts, plus companions when the situation calls for them (architecture board, customer-language journey walkthrough, builder prompts for the platform's AI or no-code builder, branded session plan). Plans the session in 15, 30, 60 or 120-minute formats: the live journey first, then the platform's dashboard in a fixed priority order. Use when someone wants to build, plan or prepare a demo of an AI agent for a customer. NOT for POCs (use frame-poc)."
---

# Build a demo

Run the proven process. Don't improvise a new one. This file is the driver; depth lives in the
reference files.

## Load first

Paths in this file are relative to the plugin's root folder: two levels up from this file.
In Claude Code that folder is `${CLAUDE_PLUGIN_ROOT}`. In Devin, it's the installed plugin's folder.
If this skill is loaded through a symlink (e.g. from `~/.config/devin/skills/`), the plugin root is `~/demo-playbook/`.

1. `reference/principles.md`: enforce it throughout and push back when a
   request trips a rule.
2. `PRODUCT_MAP.md`: which product plays which role on this platform. If
   rows are still `TODO`, say which ones block this demo and ask.
3. `PLATFORM_NOTES.md` (team repo or plugin root) if it exists. These are the platform's known gotchas.
4. `reference/prompt-skeleton.md` when you reach step 5.
5. `reference/production-path.md` when the agent must reach production, or when
   the platform has an AI builder (step 6).
6. `reference/demo-formats.md` when you reach step 2: the 15/30/60/120-minute formats and the
   dashboard ladder.

## The shape (never skip)

A demo that lands is **one customer journey of about 10 minutes**, where each product plays a
distinct role. That journey is rung 1 of every format in `reference/demo-formats.md`: compressed
to ~7 minutes in the 15-minute format, and full in the 30-minute format and up. The time box
changes how much of the platform you open up after the journey, never the story itself.

| # | Beat | What the audience learns | Time |
|---|---|---|---|
| 1 | **Recognized cold open.** The customer's first message is greeted by name, with no identity questions, and a prior interaction is referenced. | "Memory is real." | ~1 min |
| 2 | **Grounded answer.** A factual question is answered verbatim from approved content. | "It doesn't make things up." | 1–2 min |
| 3 | **Wow moment.** A real self-service action changes a system of record on screen, and memory records it. | "The AI does real work." | 2–3 min |
| 4 | **Continuity moment.** A channel switch or human handoff. The first turn on the other side references what just happened. | "Context survives." This is the load-bearing beat. | 1–2 min |
| 5 | **Insight close.** The conversation ends and you show what the business sees: summary, sentiment, adherence, one custom score. | "Observable and compliance-ready." | ~1.5 min |

Rules of the shape:

- **The wow moment comes before the continuity moment**, so the reference on the other side has
  something to point at.
- **Insights go last**, so processing latency doesn't stall the middle of the demo.
- If the use case won't fit the shape, say so. Adapt the specifics, or recommend a different use
  case. **A feature catalog is not a demo.**
- If the platform can't do a beat (see PRODUCT_MAP), flip the arc honestly. Don't fake the beat.
- **Optional proof segment after the insight close (~2 min)**, for an audience that will run the
  agent or answers to a regulator: one live guardrail moment, then the golden set's pass rate and
  the version's traffic split (principles §A). Otherwise it goes in the recipe page.
- **An insight close "at scale" needs history.** A fresh account has none: seed it by script and
  say on stage that it's synthetic (principles §D).

## Give them a running start

Never start from a blank page.

1. If a previous demo on this platform exists, copy the most recent one with the closest shape. A
   recently shipped demo beats any template.
2. Otherwise, assemble from `templates/`: `DEMO_SCRIPT`, `SETUP`, the
   `sequence` diagram, and `scripts/lifecycle.ts`.
3. The **app** should be a thin overlay on the platform's SDK or starter, not something you write
   from scratch. A demo directory is: prompt + tools + knowledge + provisioning scripts + docs.
4. **On an account you didn't create, inventory it first** (read-only) and save the inventory with
   the demo. Everything you build is **additive**: keep all of what's there, and adapt your spec
   to it (principles §E).

## The process: draft first (propose, don't interrogate)

People lose time staring at empty fields. Ask only what only they know, then hand over a concrete
80%-right draft to react to. Confirm each step before moving to the next.

1. **Workflow.** Ask what you can't infer:
   - the end customer's main channel
   - the most common inbound reason (this becomes beat 2)
   - the ONE self-service action that moves their P&L (beat 3)
   - the regulator
   - the system of record
   - **the session length (15, 30, 60 or 120 minutes) and who's in the room**. This picks the
     format.

   Then **write the one-paragraph journey yourself** and let them correct it. If you can't write
   one paragraph, ask one more question.
2. **Arc.** Draft a minute-by-minute run sheet for the chosen format (`reference/demo-formats.md`):
   the journey fitted to the shape, then the dashboard ladder rungs that fit the time box, each
   with one line of why it matters to this customer. They move or cut beats and rungs.
3. **Persona and tone.** Offer 2–3 short persona names plus a 3-bullet tone dial:
   - formal/regulated → precise and low-warmth
   - retail → warm and direct
   - health → precise and empathetic, never clinical
   - collections → empathetic and firm, no shame
4. **Tools.** Draft 3–8 tools, each with a one-line purpose and the system it touches.
   - Almost always: knowledge search and human handoff.
   - Usually: read and write on the system of record, plus a "record customer signal" memory write.
   - Sometimes: channel-switch sender, image/document processing, new-customer registration.
5. **Prompt.** Generate it from `reference/prompt-skeleton.md`, ~150–250 lines, with the
   constraints section already citing their regulator. Hand over a full draft, not a form. If the
   customer will see the prompt during the demo, write it (and the tool descriptions) in their
   language from the start (principles §I).
6. **Path to production** (when the agent must go live, or the platform has an AI builder). Route
   each artifact by `reference/production-path.md`: code through Git, flat config through the
   API, builder-only definitions through builder prompts from the spec (`reference/artifacts.md`
   §4a), with the gates in that file.
7. **Rehearse.** At least 3× against a stopwatch, with a scripted reset between runs.

The user should be editing and rejecting, never writing from blank.

## Deliverables

### Required: a demo isn't done without these

1. **Sequence diagram (Mermaid).** Actors: customer, channels, agent, memory, knowledge, system of
   record, insights, human desk. Cover all five beats, including the continuity moment. **It must
   render** (rules below).
2. **Demo script (`DEMO_SCRIPT.md`).** Use `templates/DEMO_SCRIPT.template.md`. Include:
   - a pre-flight checklist
   - an opening frame (30 s)
   - for each beat: what to *show*, what the customer *sends* (exact text), what's *expected* (the
     agent's behavior), what to *point at* on screen, and a narration line
   - a timing budget per beat

   Write it in the language of the demo.
3. **`SETUP.md`**, written for a technically capable teammate who is **not** fluent in the code.
   The spec is below, and the template is `templates/SETUP.template.md`.
4. **Customer recipe page.** One per customer, **always in English**, because it's internal
   library material. The spec is in `reference/artifacts.md`. Publish it as an artifact when
   possible, otherwise write it to `docs/recipe.html`.
5. **Lifecycle scripts:** `npm run provision` and `npm run teardown`.
   - Provision orchestrates the per-resource scripts, captures every created id and **writes it
     back to `.env`**, liveness-checks existing ids instead of trusting them, deploys, and prints
     what's left to do by hand.
   - Teardown is dry-run by default (`--apply` to execute) and frees the account-limited
     resources. It keeps by policy whatever is shared or slow to re-earn, such as approvals and
     shared configs.
   - Start from `templates/scripts/lifecycle.ts`. Rules are in principles §F.

### Companions: produce when the situation calls for them

6. **Architecture overview board** for exec conversations. Dark, numbered lanes, product-chip
   cards with a color legend. Hand-built HTML, not Mermaid.
7. **Journey walkthrough** whenever the demo is shared with the customer before demo day. It is
   **in the customer's language**, uses the real smoke-test dialogue, and maps their briefing
   challenges to beat numbers.
8. **Builder prompts** whenever the platform has an AI builder (required then, because they're how
   the agent gets built), or a no-code recreation when the demo should be rerunnable without the
   code. Both state the deltas honestly.
9. **Session plan** whenever the customer gets an agenda before the session. It's one page in the
   customer's language with the format, the minute-by-minute agenda and what they'll see on
   screen, rendered with the company's brand tooling (PRODUCT_MAP "Brand and branded artifacts").

Specs for 6–9 are in `reference/artifacts.md`.

## Mermaid: it MUST render

- Declare every participant with a **short, space-free id and an alias**, for example
  `participant AG as AI Agent` (no quotes: some renderers print them literally). Reference
  **only the id** on message and `Note` lines. A spaced
  display name in an actor position is the #1 cause of `Expecting … arrow … got 'NEWLINE'`.
- Every interaction line is `ID ->> ID: text` (call) or `ID -->> ID: text` (return). Annotations use
  `Note over A,B: text`. Never leave a bare prose line.
- `alt` / `opt` / `loop` / `par` / `rect` each close with `end`.
- One physical line per message. Use `<br/>` to wrap long text.
- Keep labels ASCII-simple. Avoid semicolons and unbalanced brackets.
- **Validate before calling it done:** `npx -p @mermaid-js/mermaid-cli mmdc -i diagram.mmd -o /tmp/out.svg`.
  Read the `line N` in any parse error, fix it, and re-render.

## SETUP.md spec

The reader can use a terminal, edit `.env` and run `npm run <x>`. They should never have to read
source code to know what to do. Required sections, in order:

1. **Header**: what the demo is, a realistic time estimate ("~4–6 h first time, ~1 h rebuild"),
   and a table of contents.
2. **Prerequisites** as checkboxes: every account, credential type, CLI and runtime version.
3. **Local environment**: `cp .env.example .env`, install, and **every `.env` variable with a
   one-line explanation of where its value comes from** (filled by hand, or by a script). Add a
   sanity-check one-liner.
4. **One-time console setup**: anything that can't be scripted, with exact clicks.
5. **Provisioning scripts.** ORDER MATTERS. Number the sequence, and end each step with the exact
   id that lands in `.env` before the next step runs. Then add: "`npm run provision` does all of
   this in one command." Keep the manual sequence documented so the reader understands what it did.
6. **Handoff wiring**: the human-desk side, plus a curl smoke test.
7. **Deploy**, including the region and why.
8. **Webhooks and channels**: every URL to paste and where it goes.
9. **Smoke test**: a numbered click-through of the real journey, with the **expected result**
   at each step.
10. **Rehearsal loop and reset**: `npm run reset`, and what it does, in order.
11. **Common issues**: a **symptom → likely cause → fix** table. Seed it from PLATFORM_NOTES.
12. **Teardown**: what is deleted, what is kept by policy, the manual follow-ups, and
    "rebuild = §5 onward, ~30 min".

## Demo directory shape

```
<customer>-<usecase>/
├── README.md                 # the journey in one paragraph + pointers
├── SETUP.md                  # required
├── DEMO_SCRIPT.md            # required
├── docs/sequence.mmd         # required (validated)
├── docs/recipe.html          # fallback if artifact publishing is unavailable
├── .env.example              # every var, commented with its source
├── src/
│   ├── index.ts              # thin: platform SDK/starter + config
│   ├── prompts/systemPrompt.md
│   └── tools/
├── knowledge/                # version-controlled knowledge sources, one .md per topic
└── scripts/
    ├── create-*.ts           # one per provisioned resource
    ├── seed-*.ts             # persona profile, history, system-of-record rows
    ├── close-open-sessions.ts
    ├── purge-runtime-memory.ts
    ├── provision.ts          # orchestrates create-* and writes ids to .env
    └── teardown.ts           # dry-run by default
```

`package.json` exposes every script, plus `reset` = close open sessions → purge runtime memory →
reseed. Give each demo its own local port so several can run side by side.
