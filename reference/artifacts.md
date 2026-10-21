# Artifact specs

The pages that turn a working demo into reusable knowledge (internal) and a predictable session
(customer-facing). Publish them as web artifacts when that's available. Otherwise write them as
self-contained HTML files under `docs/`.

## Use-case library

Tag each customer's recipe with one **primary** use case and a few **secondary** ones. Starting
list (add and remove as the portfolio grows):

- Multichannel inbound self-service and IVR/IVA replacement
- Intelligent contextual handoff
- Real-time observability and compliance monitoring
- Persistent conversations and contextual history
- Automated wrap-up and knowledge capture
- Real-time live-agent assist
- Supervisor coaching and insights
- Warm-start outbound agents
- Lead prioritization and alerts
- Automated surveys and NPS
- Click-to-call and channel escalation
- Proactive and event-driven outreach
- Bulk messaging with conversational follow-up

Keep a running list of **gaps**: use cases no recipe covers yet. Those are the next demos worth
building.

---

## 1. Customer recipe page (required, one per customer, ALWAYS in English)

Internal library material. Sections, in order:

1. **Use-case fit**: the primary use case plus secondaries from the list, each with a one-line
   reason.
2. **Problem and business context**: what hurts, who feels it, what changes if it's solved.
3. **Demo narrative**: the one-paragraph journey, then the beats.
4. **Architecture**: a Mermaid flowchart, a component table (component · role · product), and the
   **load-bearing decisions** (the 3–6 choices that, if made differently, would break the demo or
   the production path).
5. **Sequence diagram**: the validated one from the demo.
6. **Demo script**: the full script with its timing budget.
7. **Complete system prompt, rendered in English.** State explicitly that the runtime prompt
   stays in the demo's locale. When the prompt was written in the customer's language (because the
   customer sees it, principles §I), render the English copy and say which file is the source of
   truth.
8. **Builder prompts** (§4): the production build set and/or the no-code recreation, when they exist.
9. **Repo state and action items**: a table of what exists, what's missing, and who owns it.

Validate every Mermaid block before publishing.

## 2. Architecture overview board (optional, for exec conversations; English)

A presentation piece, not a diagram. Hand-built HTML/CSS, not Mermaid.

- Dark background. Title, then a **one-line monospace flow summary** under it
  (`customer → channel → agent → tools/memory → human → insights`).
- **Numbered lanes**: `01 Inbound channel` → `02 Virtual agent and LLM layer` →
  `03 Human agent and intelligence`.
- Each lane holds **bordered cards**. Each card is one component with **product chips**,
  color-coded by a legend: *platform product* vs *LLM/AI layer* vs *external or customer system*.
- It must work on a laptop screen without scrolling the main lanes.

## 3. Journey walkthrough (customer-facing, in the CUSTOMER'S language)

Encouraged whenever the demo is shared with the customer before demo day. Purpose: make the
session predictable for them.

- **Front stage / back stage for each numbered beat.** The front stage is a chat-bubble or phone
  mock using the **real dialogue from smoke tests**, including mocks of rich messages and cards.
  The back stage is a "behind the scenes" panel with product chips. Use a legend that separates
  *platform product* from *customer system (simulated)*, and be honest about what's simulated.
- **Two tabs:**
  - *Step by step*: the scrolling, detailed view.
  - *Overview*: one screen, no scrolling. A card grid with the beat number, short title, one line
    and one chip, closing with the customer's briefing challenges as a ✓ strip.
- **End by mapping the customer's own briefing challenges to beat numbers.** This is what shows
  them they were heard.

## 4. Builder prompts (when the platform has an AI builder or a no-code builder)

Prompts that turn the written spec into the platform's build. There are two uses, and a demo may
need either or both.

### 4a. Production build (AI builder): the default when one exists

The spec in our repo, plus these prompts, should be enough for a teammate to rebuild the agent.
The method and gates are in `reference/production-path.md`. A numbered set, one prompt per thread:

0. **Standing instructions** for the builder (its project or vault file, if it has one): the
   customer's language for everything customer-facing, "copy the spec verbatim, never translate or
   reword", protected resource names, and capabilities that must never be created (for example,
   "no unlock tool").
1. **Build** each definition the platform says not to hand-write, attaching the spec files. Start
   with "copy verbatim", exact tool names, and "if a referenced tool doesn't exist, stop and list
   it". End with "run a conflict check before creating anything".
2. **Conflict and coverage check** after the build: contradictions, forbidden paths, wrong tool
   calls, branches with no exit. Report only, no changes.
3. **Golden set**: the scenario list from the demo plan, with mocked tool outputs and one assertion
   per forbidden behavior.
4. **Monitors**: the QA rubric and flag criteria the insight close shows.
5. **Verification**: trace, legally sensitive lines, guardrails, diff since the last version. Run
   before every publish.
6. **Live analyst questions** for the insight close, in the customer's language, if the builder can
   answer questions about the data.

Build tools before definitions, so the builder references real tools. Use the builder's strongest
reasoning mode for building.

### 4b. No-code recreation: when the demo should be rerunnable without the code

A description-to-demo input that recreates the demo on the fast builder. Structure:

1. Goal
2. Persona
3. Customer (seed profile and records)
4. Tools mapped to the builder's built-ins
5. The journey, adapted to the builder's default arc
6. **Adaptations**: the deltas vs the code demo, stated honestly
7. **Paste-ready prompt fields**, split the way the builder wants, with the language line first
8. Out of scope
9. Rehearsal notes

Map each custom tool to the nearest built-in and **state the delta**. When the wow moment doesn't
reproduce, name it and flip the arc. Don't imitate it.

Mirror whichever of 4a/4b exists into the recipe page (section 8).
