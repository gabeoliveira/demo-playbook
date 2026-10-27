# Demo formats: 15, 30, 60 and 120 minutes

The story never changes with the time box. **What changes is how much of the platform you open up
behind it.** Every format starts with the live agent journey, then walks the platform's dashboard
in a fixed priority order, going as deep as the time allows.

Which product plays each rung on your platform is in `PRODUCT_MAP.md` ("Dashboard ladder").

## The dashboard ladder (always in this order)

The agent journey uses everything underneath it: tools, guardrails, knowledge, memory. The ladder
is about **what you open on the dashboard**, and in what order, once the journey has run.

| Rung | What you show | Why it's in this position |
|---|---|---|
| **1. The agent experience** | A live conversation running the real procedure, end to end (the five-beat arc in `skills/build-demo/SKILL.md`) | It's the product. Everything else explains it |
| **2. The AI builder and self-improvement** | The platform's AI builder changing the agent, and its self-improvement loop proposing a validated fix | It answers "who keeps this good after launch?" |
| **3. Analytics** | What the business sees across all conversations: insights, typed signals, QA at scale | It turns one good conversation into a measurable program |
| **4. Guardrails and guidelines** | The safety layer (one live adversarial turn), then the behavior rules | Regulated buyers ask about this first; everyone asks eventually |
| **5. Tools** | How the agent acts on real systems: tool code, how it's versioned and tested | Technical evaluators need it; business buyers usually don't |
| **6. The rest of the platform** | Knowledge, memory, versioning and rollout, simulations, voice configuration, APIs | Depth for a platform evaluation |

## The four formats

Times are budgets, in minutes. "Q&A" is a held buffer, not leftover time.

| Segment | 15 | 30 | 60 | 120 (deep-dive) |
|---|---|---|---|---|
| Opening frame | 0.5 | 1 | 2 | 5 (goals + agenda) |
| Discovery recap ("what we heard") | — | — | 3 | 5 |
| **1. Agent experience (live)** | 7 | 11 | 15 | 20 |
| **2. AI builder / self-improvement** | 4 | 6 | 12 | 25 |
| **3. Analytics** | 1.5 | 5 | 10 | 20 |
| **4. Guardrails and guidelines** | — | 3 | 7 | 15 |
| **5. Tools** | — | — | 5 | 15 |
| **6. Rest of the platform** | — | — | — | 10 |
| Close + Q&A | 2 | 4 | 6 | 5 |
| **Rungs covered** | 1–3 (3 as a glimpse) | 1–4 | 1–5 | 1–6 |

### 15 minutes: "see it work"

- **Journey, compressed (7 min):** cold open → wow moment → continuity moment, and one line of the
  insight close. Fold the grounded answer into the cold open. Never cut the wow or the continuity
  moment: without them there's no story.
- **AI builder (4 min):** one live ask, for example "why did this conversation escalate?" or "add
  this rule", with the proposed change and its diff on screen.
- **Analytics (1.5 min):** one chart that the journey just fed.
- No guardrails or tools segment. If asked, answer in one sentence and offer the 60-minute session.

### 30 minutes: the default customer demo

- **Journey, full arc (11 min):** all five beats, insight close included.
- **AI builder and self-improvement (6 min):** a live edit with its diff, then one
  self-improvement proposal with its validation result.
- **Analytics (5 min):** insights by intent, the journey's typed signals at volume, and one QA
  monitor finding.
- **Guardrails and guidelines (3 min):** the guardrail moment (principles §A), then where the
  behavior rules live.

### 60 minutes: business plus technical audience

- **Journey (15 min):** the full arc plus one alternate path, such as the adversarial line or the
  "customer recognizes the purchase" branch.
- **AI builder and self-improvement (12 min):** build or change a procedure live, run its
  simulations, and review a self-improvement proposal end to end.
- **Analytics (10 min):** add root-cause analysis and one natural-language question to the data.
- **Guardrails and guidelines (7 min):** the guardrail moment, the custom guardrails, and how a
  guideline change is tested before it ships.
- **Tools (5 min):** one tool's code, its tests, and where it's versioned.

### 120 minutes: platform deep-dive

- **Hands-on where possible.** The evaluator drives the AI builder in a workspace of their own.
- **Journey (20 min):** both channels, plus failure and handoff paths.
- **AI builder and self-improvement (25 min):** build a small procedure from a spec, simulate it,
  publish it at 0%, and read the self-improvement health report.
- **Analytics (20 min):** the full Voice-of-Customer story, monitors and alerts.
- **Guardrails and guidelines (15 min):** every layer, before, during and after the conversation.
- **Tools (15 min):** code, Git, CI, idempotency and secrets.
- **Rest of the platform (10 min):** knowledge, memory, versioning and rollout, voice
  configuration, APIs.

## Rules

- **The journey always runs first and always runs live.** A recording is a fallback, not a format.
- **Running long? Cut from the bottom of the ladder up.** Never drop a higher rung to keep a lower
  one. Running short is fine: end on the rung you finished.
- **Each rung opens with one line of why it matters to *this* customer.** No rung without a reason.
- **Show the dashboard through the journey's own conversation** wherever possible: its trace, its
  signals, its QA score. That keeps one story running through the dashboard segment.
- **Hold the Q&A buffer.** If questions start early, take them and cut from the bottom of the
  ladder.
- **Deeper formats need more prep.** Analytics at 30+ minutes needs seeded history (principles
  §D). The 120-minute hands-on needs a workspace per evaluator, and it's additive (principles §E).
- **Pick the format when you book the session, not on the day.** The session plan (artifacts §5)
  goes to the customer beforehand, so they know what they'll see.
