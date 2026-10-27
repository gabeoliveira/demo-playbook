# <<demo-name>>: demo script

Persona: **<<PersonaName>>** (<<role, brand>>). Customer: **<<Customer Name>>**
(<<segment, key account facts the story leans on>>). Language: <<locale>>.

**Format: <<15 | 30 | 60 | 120>> min** (reference/demo-formats.md). Journey ≈ <<x>> min (beat 1 ≈ <<x>> ·
beat 2 ≈ <<x>> · beat 3 ≈ <<x>> · beat 4 ≈ <<x>> · insight close ≈ <<x>>) · dashboard ladder ≈ <<x>> min ·
Q&A ≈ <<x>> min.

## Pre-flight (presenter checklist)

- [ ] `npm run reset` has run (closes sessions, purges runtime memory, reseeds).
- [ ] The app is up: `<<health URL>>` → `{"status":"ok"}`.
- [ ] Presenter's phone: <<which app or chat is open, and on which thread>>.
- [ ] Shared screen tabs, in order: <<system of record>> · <<agent trace / dashboard>> ·
      <<human desk with an agent logged in>> · <<insights view>>.
- [ ] Fallback ready for the riskiest beat: <<what you do if it fails>>.

> **Opening frame (30 s):** "<<One-sentence setup of who the customer is and what's about to go
> wrong or right for them. Then: we'll follow them across N channels in one conversation, and
> see what's recorded when it ends.>>"

---

## Beat 1: <<Recognized cold open>> (~<<x>> min)

**Show:** <<what's on screen when the beat starts>>

**<<Customer>> (<<channel>>):** `<<exact message to send>>`

**Expected:** <<the agent's behavior. Greets by name with no identity questions, references
<<prior interaction>>. Describe behavior, not exact wording, unless the wording matters.>>

**Point at:** <<what to highlight: the memory block, the profile, etc.>>

> Narration: "<<one line that names the capability without jargon>>"

## Beat 2: <<Grounded answer>> (~<<x>> min)

**<<Customer>>:** `<<factual question>>`

**Expected:** <<the answer with the key figures VERBATIM from knowledge: list them so the
presenter can check>>

> Narration: "<<…>>"

## Beat 3: <<Wow moment>> (~<<x>> min)

**<<Customer>>:** `<<request that triggers the action>>`

**Expected:** <<the confirm sequence>> → the customer says `<<yes>>` → <<result with ids or values>>

**Show:** <<system of record row: field → NEW VALUE>> · <<memory observation landing>>

> Narration: "<<…>>"

## Beat 4: <<Continuity moment>> (~<<x>> min)

**Show:** <<the switch: button, link, or call>>

**<<Customer>> (<<new channel>>):** `<<first line>>`

**Expected:** First turn greets by name and references <<beat 3 action>> **without being asked**.

> Narration: "<<…>>"

## Beat 5: Insight close (~<<x>> min)

**Show:** <<insights view>>. Wait ~<<n>> s after ending the conversation.

Walk through: summary · sentiment · adherence · <<custom score that fits the vertical>>.

> Closing line: "<<the business outcome in one sentence>>"

---

## Dashboard segment (the ladder, in order; keep only the rungs your format covers)

Show each rung through the journey's own conversation where you can. Running long? Cut from the
bottom up.

### Rung 2: <<AI builder / self-improvement>> (~<<x>> min)

**Why it matters to <<customer>>:** <<one line>>

**Show:** <<the live ask or edit, the proposed change and its diff, the validation result>>

> Narration: "<<…>>"

### Rung 3: <<Analytics>> (~<<x>> min)

**Why it matters:** <<one line>> · **Show:** <<insights by intent, the journey's signals at volume,
one QA finding>> · Seeded history labeled as synthetic? <<yes/no>>

### Rung 4: <<Guardrails and guidelines>> (~<<x>> min)

**Why it matters:** <<one line>> · **Live line:** `<<the adversarial message>>` → **Expected:**
<<refusal + where it's logged>>

### Rung 5: <<Tools>> (~<<x>> min)

**Why it matters:** <<one line>> · **Show:** <<one tool's code, tests, where it's versioned>>

### Rung 6: <<Rest of the platform>> (~<<x>> min)

**Show:** <<knowledge, memory, versioning and rollout, voice configuration, APIs: pick what this
audience asked about>>

> **Close (30 s):** "<<the business outcome in one sentence, and the next step>>"

## If something goes wrong

| Symptom on stage | Recover by |
|---|---|
| <<agent doesn't recognize the customer>> | <<line to say + action>> |
| <<action fails>> | <<fallback>> |
| <<insights not ready>> | <<show a pre-captured result from the rehearsal>> |
