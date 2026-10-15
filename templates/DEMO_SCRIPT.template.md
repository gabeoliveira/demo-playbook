# <<demo-name>>: demo script

Persona: **<<PersonaName>>** (<<role, brand>>). Customer: **<<Customer Name>>**
(<<segment, key account facts the story leans on>>). Language: <<locale>>.

**Total: ~10 min** (beat 1 ≈ <<x>> min · beat 2 ≈ <<x>> min · beat 3 ≈ <<x>> min ·
beat 4 ≈ <<x>> min · insight close ≈ <<x>> min).

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

## If something goes wrong

| Symptom on stage | Recover by |
|---|---|
| <<agent doesn't recognize the customer>> | <<line to say + action>> |
| <<action fails>> | <<fallback>> |
| <<insights not ready>> | <<show a pre-captured result from the rehearsal>> |
