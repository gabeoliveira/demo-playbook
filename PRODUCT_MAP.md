# Product map: capability → product on this platform

The story never changes. The products that play each role do. Fill the **This platform** column
during onboarding. Until a row is filled, the skills fall back to the generic description.

How to fill a row:

- **This platform** is the product or feature name, plus the docs link.
- **Provisioned by** says how a demo creates it: API, console, CLI, or "ask someone".
- **Limited?** records any per-account cap or approval gate. These are what teardown exists to free.

| Capability | Role in the story | This platform | Provisioned by | Limited? |
|---|---|---|---|---|
| **Agent brain / procedures** | Where the agent's behavior lives: prompt, procedures, tool selection. | _TODO_ | | |
| **Conversation session** | One conversation id that survives channel switches and handoff. Makes "continuity" real. | _TODO_ | | |
| **Customer memory / profile** | Recognize the customer on message 1, recall prior interactions, write what just happened. | _TODO_ | | |
| **Knowledge / grounding** | Answers verbatim from approved content: "no hallucination". | _TODO_ | | |
| **Tools / actions** | The wow moment: a real state change in a system of record. | _TODO_ | | |
| **Simulated system of record** | Stands in for the customer's CRM/core. Mock data inside the demo's own backend: held in memory, seeded at boot, snake_case fields, with an admin reset route and a back-office page that shows rows change on screen. No external database. | Demo backend (default) | Deployed with the demo | no |
| **Messaging channels** | Chat, WhatsApp, SMS, email: usually the cold open. | _TODO_ | | |
| **Voice runtime** | ASR, TTS, turn-taking, interruption. Latency lives here. | _TODO_ | | |
| **Channel-switch mechanism** | How the customer moves from one channel to another inside one story (button, link, callback). | _TODO_ | | |
| **Human handoff** | Escalation with full context. The human never re-asks. | _TODO_ | | |
| **Agent desktop / context panel** | What the human sees when the handoff lands. | _TODO_ | | |
| **Post-conversation insights** | Summary, sentiment, QA/adherence scoring, custom scoring. The insight close. | _TODO_ | | |
| **Templates / approvals** | Outbound messages that need pre-approval (lead time). | _TODO_ | | |
| **Hosting** | Where the demo app runs. Pick the region closest to the voice infrastructure, not the user. | _TODO_ | | |
| **AI builder / no-code builder** | Builds or edits the agent from a prompt: the route for definitions the platform says not to hand-write. Also a fast path when the wow moment needs no custom tool. | _TODO_ (if any) | | |
| **Config-as-code and versioning** | Where the build lives (Git format, environments, branches), how a version is published, how traffic ramps, and how rollback works. | _TODO_ | | |
| **Guardrails / safety layer** | Built-in protections (manipulation detection, action validation) plus custom input/output rules. The guardrail moment. | _TODO_ | | |
| **Evals and monitors** | Golden-set simulations, QA rubrics, recurring monitors. The proof segment and the production gates. | _TODO_ | | |
| **Analytics at volume** | Dashboards, intents and charts that need history, and the supported way to seed synthetic history (and delete it by marker). | _TODO_ | | |
| **Observability** | Where to read the wire when something breaks: event timelines, per-leg errors. | _TODO_ | | |
| **Brand and branded artifacts** | Customer-facing pages in the company's look and voice: the session plan, the journey walkthrough. | _TODO_ | | |

## Dashboard ladder (for the formats in `reference/demo-formats.md`)

What each rung shows on this platform. The order is fixed. The names are filled for **Decagon**
(checked against the `decagon-brand` skill, 2026-10-26). The rest of the Decagon mapping is in
"Filled: Decagon" below. On another platform, replace that column.

| Rung | Capability | Decagon |
|---|---|---|
| 1 | The agent experience | A live **AOP** (Agent Operating Procedure) conversation on chat or voice, with **Trace View** for the reasoning |
| 2 | AI builder and self-improvement | **Duet** (builds and edits AOPs and tools, generates tests) and **Duet Autopilot** (validated improvement proposals with diffs, a health report, human approval) |
| 3 | Analytics | **Insights** (intents, root cause, escalation drivers, Voice of Customer), **Action Trackers**, **Watchtower** (QA on 100% of conversations), **Ask AI** |
| 4 | Guardrails and guidelines | **Guardrails** (built-in layers such as bad-actor detection and action validation, plus custom guardrails) and **Guidelines** |
| 5 | Tools | **Tools** (Python, Git-backed, MCP) and **Automations** |
| 6 | The rest of the platform | **Knowledge**, **User Memory**, **Agent Versioning** and **Experiments**, **Simulations**, voice profiles, **Agent Workbench**, integrations, the public API |

## Onboarding questions to answer

- What is the unit of "a conversation"? Does it survive a channel switch, or does the platform
  stitch separate sessions by customer identity?
- How is the customer identified on the first message (phone, email, auth token)? Can a demo seed
  a profile ahead of time?
- How does the agent call an external system? Do custom tools exist, or only a fixed menu? Any
  timeout or latency budget?
- How does handoff carry context to the human? What does the agent desktop show by default?
- Which resources are account-limited or approval-gated, and how long do approvals take?
- What's the "reset" story? How do you close or clear conversations and memory for a test
  persona, and what is async (extraction lag)?
- Where is the per-leg error timeline when voice misbehaves?
- Is there a sandbox or demo account shared with teammates? (If so, see principles §E.)
- Which artifacts have a Git format, which have a public API, and which can only be made in the
  console or by the AI builder? (This decides each artifact's route in `reference/production-path.md`.)
- How is a version published, how does traffic ramp, and how do you roll back without a redeploy?
- Which guardrails are built in and always on, and what does a custom guardrail look like? Where
  does a fired guardrail show up (audit log, trace)?
- How much history do dashboards, intents and monitors need before they show anything, and how
  do SEs seed and later delete synthetic history?

## Mapping a previous demo onto this platform

Port the story and re-derive the mechanics. For each beat, ask which row above plays it here.
If a beat has no equivalent, name the gap honestly and flip the arc. Don't imitate the beat.
Example: if the channel switch doesn't exist, do voice-first with a messaging receipt.

---

## Filled: Decagon (2026-10-22, from the Banco Galicia build)

Gotchas behind these rows: `PLATFORM_NOTES.md`. "Live" rows were exercised on a real instance.

| Capability | Role in the story | Decagon | Provisioned by | Limited? |
|---|---|---|---|---|
| **Agent brain / procedures** | Behavior, procedures, tool selection | Agent Operating Procedures (AOPs, V4) + Guidelines (V1 or V2 per instance) | Duet from a spec, driven by `duet-cli` (AOPs, V2 Guidelines); public API only for V1 Guidelines | 30 guidelines per workspace |
| **Conversation session** | One id across channels | One conversation per channel; context crosses via call metadata, or User Memory with a shared `user_id` | — | — |
| **Customer memory / profile** | Recognize, recall, record | User Memory (authenticated users only, tool-written); for demos, the simulated core's history | Tools | 100 KB per user; no admin purge |
| **Knowledge / grounding** | Verbatim answers | Knowledge (articles / snippets, syncs) | API `POST /article/new` (live) | ≤ 3,000 chars per article |
| **Tools / actions** | The wow moment | Coded Python 3.11 tools + shared `lib/utils.py`, Secrets | Duet or console | 60 s timeout, 2,000-token output |
| **Simulated system of record** | Rows that change on screen | Demo backend (Express, in-memory), deployed on Fly.io, one always-on machine | Deployed with the demo | no |
| **Messaging channels** | Cold open | Chat widget (`data-slug`, signed user id), WhatsApp, SMS, email | Console | WhatsApp/SMS need setup |
| **Voice runtime** | ASR, TTS, turn-taking | Decagon voice; voice profiles per language (Build > Customization > Voice), TTS from Cartesia, ElevenLabs or MiniMax. Pick from the profile's **Recommended** voices; others need #tech-support. pt-BR: PLATFORM_NOTES #14b | Console + Decagon team | provisioned number |
| **Channel-switch mechanism** | Chat → voice | Outbound Voice campaigns (Missions API) with `outbound_reason` + context metadata | API + console campaign | **US recipients only** |
| **Human handoff** | Escalation with context | Voice: `Conversation.dial_number` warm transfer (spoken summary), SIP; chat: Zendesk / Salesforce / custom escalations | Tools | — |
| **Agent desktop / context panel** | What the human sees | Warm-transfer summary; ticketing integrations | Tools / integrations | — |
| **Post-conversation insights** | The insight close | Watchtower (flags + categories), Insights, Duet analytics | API `POST /watchtower/job` (live) or Duet | per-instance Watchtower cap; recurring skips last 24 h |
| **Outcome metrics** | The success-fee meter | Action Trackers (`Conversation.emit_action`) | Console (Duet support undocumented) | not versioned |
| **Templates / approvals** | Outbound pre-approval | SMS A2P campaign registration | Decagon team | 1–3 weeks |
| **Hosting** | Where the demo app runs | Fly.io, US region (`sjc`) | `fly deploy --ha=false` | one machine |
| **AI builder** | Builds from a spec | Duet (Vault `AGENTS.md`, artifacts, Autopilot); `duet-cli` drives it from Claude Code for AOPs, tools, guidelines, guardrails, knowledge, Simulations and analytics, in a named workspace (PLATFORM_NOTES #1d) | `duet-cli` or dashboard | not Action Trackers or AOP-level settings |
| **Config-as-code and versioning** | Build, publish, ramp, roll back | Agent Versioning (Git-backed workspaces), traffic split | Console | workspace must exist first |
| **Guardrails** | The guardrail moment | Built-in (Detect Malice, Action Validation, sensitive content, internal leakage) + custom input/output | Duet / console | output guardrails need chat streaming off |
| **Evals and monitors** | Proof segment | Simulations (personas, checkpoints, tags; scheduled runs use AND on tags) | Duet | — |
| **Analytics at volume** | Charts with history | Insights, Action Tracker charts (fill from real runs and Simulations) | — | — |
| **Observability** | Read the wire | Audit log, Trace View, Agent Workbench | — | — |
| **Brand and branded artifacts** | Session plan, walkthrough | `decagon-brand` skill (product names, voice, writing rules) + `brand-pdf` skill (renders branded HTML/PDF) | Claude skills | — |
