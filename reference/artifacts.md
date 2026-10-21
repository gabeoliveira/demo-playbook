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
8. **No-code recreation** section, when one exists.
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

## 4. No-code recreation prompt (when the platform has a no-code or fast builder)

A description-to-demo input that recreates the demo on the fast builder, so others can rerun it
without the code. Structure:

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
reproduce, name it and flip the arc. Don't imitate it. Mirror this section into the recipe page.
