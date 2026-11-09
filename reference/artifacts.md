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

## 5. Session plan (customer-facing, in the CUSTOMER'S language, branded)

Send it when the session is booked, so the customer knows the format and what they'll see. One
page. It's the customer's version of the presenter's DEMO_SCRIPT, and it never carries internal
notes, fallbacks or timings for us.

1. **Title and format:** the customer, the use case, and "15 / 30 / 60 / 120 minutes"
   (`reference/demo-formats.md`).
2. **What you'll see:** the journey in two or three sentences, in the customer's own terms, with
   the persona and the moment that matters most to them.
3. **Agenda:** a minute-by-minute table, with the journey first and then the dashboard rungs the
   format covers. Each rung gets one line on why it matters to this customer.
4. **Who should join:** the roles the format serves best, for example CX leadership at 30 minutes,
   plus engineering and compliance at 60 or 120.
5. **What we need from you:** only what only they can provide, such as a policy to confirm or a
   hands-on login for the deep-dive.
6. **After the session:** the next step and when it happens.

Rules:
- **The customer's language, the company's brand.** Write the copy with the company's brand skill
  (product names, voice, writing rules), then render it with its brand tooling as HTML or PDF.
  PRODUCT_MAP "Brand and branded artifacts" names both. Use real product names only.
- **Only promise what the format covers.** If the agenda says Tools, the format must include rung 5.
- **No invented dialogue or numbers.** Describe what they'll see. Quote lines only from smoke tests
  (principles §I), and use metrics only from approved customer references.
- Publish it as an artifact when possible, otherwise write it to `docs/session-plan.html` (or `.pdf`).

## 6. Talk-track page (presenter-only, in the language of the demo)

The presenter's live view of `DEMO_SCRIPT.md`, open on a second screen or a tab next to the demo.
The script is for preparing and for a teammate who runs the demo; this page is for finding the
next line in two seconds. Template: `templates/TALK_TRACKS.template.html` (one self-contained
file, no dependencies, light and dark).

1. **Navigation:** a sticky segment list with minutes, a timeline bar whose widths are the
   minutes, and keys: number keys jump to a segment, `q` opens Q&A, `/` focuses its filter.
2. **One card per segment:** a time chip, a one-line "Show:", the talk tracks, the presenter's
   own lines (what they say or type as the persona, numbered, in monospace), and the cut line.
3. **Talk tracks colored by audience:** to the room, stakeholder A, stakeholder B, and the
   proactive competitor point, with a legend at the top. Write each stakeholder's line in their
   terms, not the same sentence twice.
4. **Then:** recovery (the line to say plus a symptom → action table), the pivot map, Q&A
   (collapsible, filterable, 2–3 sentence answers), reactive competitor objections, and a
   "don't say" chip list.
5. **Fill-ins highlighted** (`.fill`) for anything still unknown, so nothing unverified gets said.

Rules:
- **Lines only.** Setup, expected agent behavior, checks and fallbacks stay in the script; the
  page links back to it.
- **Sources stay quiet.** A small faded superscript link (`docs↗`, `blog↗`, `internal↗`) at the
  end of the line it backs up, brightening on hover and opening in a new tab. Never a footnote
  list, never prose links inside a talk track.
- **Nothing but the line gets copied.** Hints, tags and source links are unselectable: a label
  copied along with a scripted line reaches the agent, and its guardrails read it.
- **Credit what actually ran.** When a line says which layer caught something (a guardrail, a
  built-in check, a tool), check it against the trace, not the configuration.
- **It's a copy.** Regenerate it after every script change, and validate it before sending:
  well-formed HTML, every in-page anchor resolves, every external link opens.
- Customer-facing quotes come from smoke tests only (principles §I).

## 7. Framing slide (customer-facing, in the CUSTOMER'S language, branded)

One slide for the first segment, before any product is on screen. It says what the session is
about and why we'd start there, using the customer's own numbers. Template:
`templates/FRAMING_SLIDE.template.md` (fill it in first, then build the slide).

1. **Headline:** the moment that hurts, as their customer would say it. Six words at most, and no
   product name.
2. **Point of view:** two or three sentences. Where most vendors would start (usually the easy,
   high-volume intent the customer's current front line already handles), where we'd start
   instead and why, and what the first contact delivers. Name the painful moment the way the
   customer's own SOP or team names it.
3. **"What you told us":** three numbers from discovery, each with a label of five words or fewer.
4. **Speaker notes:** a shortened copy of the segment 1 talk track (who you are, the three
   numbers tied to who gave them, the point of view, the competitor question if there is one).

Rules:
- **Their numbers only.** Every figure comes from the customer in discovery and traces to a note.
  Confirm what each one counts before it goes up (principle 7). Our own metrics stay off this
  slide; they belong later, from approved customer references.
- **No product yet.** No screenshots, logo wall or architecture. This is the scene before the demo.
- **Start from the company's deck, never from blank.** Copy the official deck template and keep
  its "three key numbers" style slide (PRODUCT_MAP "Brand and branded artifacts"). Write the copy
  with the company's brand skill. Work only in your copy; the template stays untouched.
- **Look at it rendered.** Template text boxes are a fixed size and slide tools don't shrink text
  to fit, so a label longer than the template's own examples wraps into the edge. Keep labels as
  short as the examples and check the rendered slide before calling it done.
- **It's optional on screen.** Segment 1 must work with nothing shared. Link the slide from the
  script's pre-flight tab list (presenter view) and from segment 1's "Show:".
- **Keep the Drive clean.** One copy. If a scratch copy is left behind, name it as safe to delete
  and tell the owner. Don't trash it for them.
