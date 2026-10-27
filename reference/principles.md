# Principles: the pushback, made explicit

Anyone can copy a demo arc. The value is the judgment that keeps a demo or POC from shipping
something wrong. Every rule here started as a real correction on a real engagement.

**How to use this:** when a request trips a rule, **push back before proceeding**. State the
rule, the reason, and the corrected path. If the user overrides after hearing the reason, go
ahead: these are defaults, not locks.

---

## A. Story

- **One story, not a feature catalog.** Each product plays a distinct role in one customer's
  journey. If the use case doesn't fit the arc, adapt the specifics or change the use case.
- **The wow moment comes before the continuity moment.** The continuity beat ("as we just
  did…") needs something to reference.
- **The wow moment changes real state on screen**, such as a row updating, and memory records
  it. "The agent said it did it" is not a wow moment.
- **Insights close the demo**, so processing lag never stalls the middle.
- **If a beat doesn't reproduce on this platform, name the gap and flip the arc.** Don't
  imitate it. An honest delta survives the "wait, is that real?" question. A faked beat doesn't.
- **Optional wow beats must earn their stage time.** An identity step-up before a sensitive action
  is worth ~20 s only to a regulated or security-minded audience, and only when it gates an
  action the demo already contains. Default demos skip it.
- **A guardrail moment is the same kind of optional beat.** About 30 s: one live adversarial line
  (an authority-spoofing or prompt-injection attempt aimed at the demo's own risky action), the
  refusal, and the audit-log entry on screen. It earns its time with a regulated audience. Rehearse
  the near-misses too: genuine domain words ("reverse the charge") can trip manipulation detectors.

## B. Agent design

- **The language-enforcement line is line 1 of the prompt.** Models drift to English during
  technical reasoning.
- **Channel awareness.** Voice gets no markdown, lists or emojis, short sentences, and long
  numbers spelled out in groups. Messaging gets light markdown and concise replies.
- **Channel switches need a "supersede" hint.** Context is usually append-only. When the
  channel changes, inject: "Channel switched from X to Y. IGNORE any earlier channel line; only
  the most recent is authoritative." Otherwise the agent says "tap the button" on a voice call.
- **On the first turn in a new channel**, the agent greets by first name, references what was
  discussed and what it just did, then continues.
- **Don't prefix every message with the customer's name.** Use it at the greeting and key
  moments; otherwise it feels robotic.
- **Don't ask for data that's already in memory.**
- **Tool descriptions are the main signal the model uses to pick a tool.** Each one needs:
  - specific trigger words
  - **positive and negative triggers** ("Use for X, Y. Do NOT use for Z; that goes to handoff.")
  - "use returned values VERBATIM, don't invent"
  - a name that exactly matches the prompt's references
- **Irreversible actions get a confirm-twice sequence** with no skipped steps: confirm X, confirm
  Y, wait for "yes", and only then call the tool.
- **Handoff has explicit triggers**: knowledge returned nothing, a regulated topic, an emotional
  trigger, or the customer asked. After handing off, the agent sends one short sentence and stops.
- **The human never re-asks.** Handoff carries the reason, identity, and what the agent already
  verified or did.
- **The constraints section is load-bearing.** Cite the customer's actual regulator, because their
  compliance team reads this section first. Examples: financial advice rules, debt-collection
  rules, health data rules, consent rules for SMS and voice, card data rules.
- **Knowledge retrieval: small top-k (3–5) for factual Q&A.** Large defaults add noticeable
  latency and dilute grounding.

## C. Voice

- **Latency is a set of buckets, not one number.** Sub-second is only possible on turns with no
  tool call. A turn that calls a tool adds the round-trip plus the model's continuation time.
  Instrument each stage: end of speech → final ASR → first LLM token → tool returned → first token
  after the tool → first TTS audio. Otherwise "voice is slow" turns into a ghost hunt.
- **Use a backchannel.** The agent says a bridge phrase before slow tools, so perceived silence
  stays short even when real latency doesn't. Make it name what's being checked ("I'm pulling up
  the Caballito slots"), and only while a tool is actually running. Platforms often ship a rule
  against empty "one moment" promises, and a generic bridge collides with it.
- **Every tool whose output gets spoken returns speech-ready fields.** Amounts in words with the
  currency named, dates as speech, reference ids grouped for reading aloud. Do this on every path
  that reaches a voice turn, including profile lookups, not just the action tools. *Why:* a
  callback recap read a raw `85810000` from the one tool that didn't have a spoken field, and
  non-English voice models read long figures badly.
- **A faster model doesn't mean smoother voice.** Streaming cadence (variance between tokens,
  punctuation) drives stutter more than raw speed. Buffer at clause or sentence boundaries, and
  pin the smoother model for voice. A cheaper model is fine for messaging.
- **Host near the voice infrastructure, not near the user.** The audio path goes through the
  platform's voice region anyway.
- **Keep a live voice session to one instance in demos.** The voice socket and in-memory session
  are pinned to one process. Any out-of-band trigger (handoff, barge-in, forced hangup) balances
  independently and can land on the wrong instance. Production fix: persist
  `conversationId → {callId, instance}` at connect time, then either redirect via the platform's
  call API or route the trigger to the instance that owns the socket.
- **A drop at a fixed number of seconds is a timeout on a provider leg (ASR/TTS/LLM), not your
  logic.** Read the platform's per-call event timeline before touching code.

## D. Rehearsal and state hygiene

- **Analytics need volume, so seed history by script.** Dashboards, intent clustering and
  monitors look empty on a fresh account. Generate synthetic conversations from a deterministic
  script in the customer's language, upload them, and mark every one (a metadata key and a
  user-id prefix) so teardown deletes only those. **Say on stage that it's synthetic**, and never
  present it as the customer's data. Signals that tools emit at runtime can't be seeded: they fill
  from real runs.

- **Rehearse at least 3× against a stopwatch, with a scripted reset between runs.**
- **Reset order: close open sessions → purge runtime memory → reseed.**
  - Open sessions often hold locks: an address mapping, or a "one active conversation per
    customer" rule. A handoff usually leaves a session *inactive*, not *closed*, and that blocks
    the next run.
  - Memory layers often **merge or deduplicate** runtime writes into seed data. A reset that skips
    the purge leaves the seed contaminated.
- **Memory extraction is often asynchronous**, landing minutes after a conversation closes. Run a
  seed-safe sweep **immediately before** each rehearsal, not chained after the last one.
- **Rehearsal residue poisons memory-aware scoring.** A rubric like "prior complaints raise
  severity" reads five rehearsal complaints as a repeat complainer and escalates too early. Sweep
  first. (In production, that same behavior is a feature, and it's worth telling that story.)
- **Write memory observations in the past tense, with a date.** "Was sent a call-back link on
  2026-03-04." Never write "awaiting call". Pending-state wording goes stale and makes the agent
  tell a caller to "tap the button" after they already called.
- **Tag every write with a `source` like `{brand}-{flow}`.** That tag is your cleanup filter.
  Seeds get `*-seed` so sweeps can skip them.
- **Reuse one canonical test persona** (phone, name, email) and document it in `PERSONA.md`.
- **Keep demo memory where a script can purge it.** If the platform's memory layer can't be
  cleared by an admin API (only from inside the agent's own tools), don't put it in the demo path:
  hold the persona's history in the simulated system of record, which reset clears in one call, and
  say on the recipe page what production would use instead.

## E. Shared environments: safety

- **Additive only, always.** Everything a demo or POC puts on a platform is added alongside what's
  there. Pre-existing configuration stays exactly as it was: guidelines, procedures, profiles,
  team settings, published versions, files with content. When our spec overlaps or conflicts with
  theirs, **our spec changes**. Need a different setting? Create a new resource of ours (a new
  voice profile rather than editing the existing one). Teardown removes only what carries our
  markers.
- **Inventory before the first write.** On any account you didn't create, start with a read-only
  inventory of what's there, and save it with the demo. It's the record of what "pre-existing"
  means, and the input to the conflict check. **Count the caps too:** for every per-account limit,
  record the limit and how much of it is already used, because pre-existing resources count
  against it. *Why:* a monitor cap of 4 was hit after three of ours, because the account already
  had one.
- **Platform-managed rules can contradict yours.** Before adding your own guidelines or rules, ask
  the builder (or read the config) for conflicts with the managed and default ones, and quote both
  texts. Adapt yours. If a managed rule breaks the customer's locale or regulation and can't be
  worked around on our side, that's a change to someone else's resource: ask its owner (below).
- **Select cleanup targets by markers *we* put there**: our ids, our webhook URLs, our source
  tags, our name prefix. **Never select by "it uses my number or sender."** On a shared account
  that is never true. A real incident: a reset closed dozens of other teams' conversations, and
  closed was final.
- **Destructive bulk actions need an explicit, named target** (`--target <id> --force`). Never
  default to "all".
- **If changing an existing resource looks unavoidable, it isn't additive: stop and ask its
  owner.** Say what would change and why. Only with their OK, record the previous state first, so
  teardown restores it instead of deleting it.
- **Never delete a resource that's still attached to something live.** Re-point it first, and
  refuse otherwise.
- **The runtime often reads what's attached to a shared config, not your env var.** If two demos
  share a config, the attached memory/profile store decides whose persona the agent recalls.
  Re-point and restart. Don't assume the env var is what runs.

## F. Provisioning and lifecycle

- **Every resource is created by a script, and every id is written back to `.env` by the
  script.** "Copy the id from the console" doesn't scale and doesn't survive a teardown.
- **Liveness-check every id before trusting it.** Ids in `.env` go stale after a teardown or
  external cleanup; their presence proves nothing.
- **Make provisioning idempotent.** Re-running after a failure skips completed stages.
- **Validate before the first write, and keep partial ids.** Check every name, character set and
  count locally before creating anything; if a stage fails halfway, write the ids it did create to
  `.env` before re-throwing, so teardown can find them. *Why:* one rejected character in a name
  prefix, then one cap, each stopped a provisioning run halfway through.
- **Mark each provisioned resource required or optional.** At a cap, provisioning skips the
  optional ones with a warning and fails only when a required one can't be created. Never make
  room by deleting someone else's resource.
- **A simulated system of record that keeps state in memory runs as one always-on instance.** No
  auto-stop, no second machine, no autoscaling: a stopped instance wipes the demo's rows and a
  second one splits them. Say in SETUP that a restart reseeds, so config changes happen before
  `reset`, never mid-demo.
- **Plan for an agent that can't touch `.env`.** Many orgs block AI tools from env files by
  managed policy. Scripts must fail with a plain-language message naming the missing variable and
  where its value comes from, and `check:env` lists what's missing without printing values. The
  human edits `.env`; never route around the policy with a differently named file.
- **Retry health checks.** A destroyed and recreated app can sit behind stale DNS for minutes.
- **Deleted resource names can stay reserved for a while.** Auto-suffix on a name conflict.
- **Teardown is dry-run by default** and deletes only **account-limited** resources, the ones
  whose cap becomes the next demo's lead time.
- **Teardown keeps by policy** whatever is shared, or slow to re-earn (approved templates,
  shared configs, scoring operators). An approval burned is lead time paid again.
- **Remove a demo's UI extension via a release that keeps every other active one.** Never
  replace the whole set.
- **Tear down aggressively and rebuild mechanically.** If provisioning is fully scripted,
  rebuilding takes ~30 min.
- **If a shared account starts degrading** (APIs 404ing, features disabled), snapshot everything
  that can be cloned right away. Scripts-in-repo make migrating to a new account mechanical.
- **A demo isn't done until a teammate can run it from `SETUP.md` alone.**

## G. Debugging habits

- **Read the wire before theorizing.** For a socket-based client failing to boot, read the last
  server frame before the close; the real error is often in-band while every HTTP request is
  green. For voice, read the per-leg event timeline. For workflows, read the per-step context.
- **Reproduce outside the abstraction.** If a send fails inside a framework, call the underlying
  API directly. A different error code often names the real problem, such as an account-level
  limit or kill switch.
- **Don't let a coincident change take the blame.** A deploy or scale-down that happened at the
  same time is not evidence. The event timeline is ground truth.
- **Patches must ship.** If you patch a dependency (`patch-package`), the build must copy the
  patches before installing. Afterwards, grep for the patch marker inside the built image.
- **Ordering in API lists is not a contract.** Select by type or attribute, never by index
  (`items[0]`).
- **Use controlled experiments for mystery behavior.** Build a throwaway resource, vary one thing
  at a time, and write down the matrix. That's how a platform-side behavior change gets proven,
  not guessed.

## H. POC metric traps: disambiguate first, then reframe

### H1. Ambiguous phrasing: ask, don't reframe

- **"% handled 100% by the AI"** almost always means the autonomous-resolution rate (no human
  touched the conversation), not "target 100%". Confirm, then set a realistic target for that
  metric.
- **"Zero downtime"** in a POC usually means "the demo doesn't blank out mid-call".
- **"Real-time"** means "within minutes" for post-conversation insights, and streaming for agent
  assist. Confirm which one they mean.

### H2. Real aspirational targets: reframe explicitly (otherwise a guaranteed No-Go)

- **Contention ≥ 80% for an FAQ voice bot.** A well-run 4-week POC shows 20–40%; best-in-class
  after iteration reaches 45–60%. Reframe as a **band** (for example a 20% floor and a 30% target),
  and decide on a **composite**: contention + groundedness + handoff quality + CSAT parity.
- **"Latency ≤ 1 s", as a single number.** Reframe as turn-type buckets (for example, no tool:
  ≤1.5 s p50 / ≤2.5 s p90; with a tool: ≤3 s p50 / ≤4.5 s p90), with per-stage instrumentation and a
  backchannel requirement.
- **"Zero hallucination"** is unmeasurable. Reframe as "≥ X% grounded to a source", or "≤ Y
  failures over an adversarial set of Z prompts".
- **"Better than human" / "CSAT ≥ 90%"** with an unknown baseline. Reframe as parity (±Δ) with the
  human baseline. Beating humans is a phase-2 conversation.
- **"Reduce headcount by N"** is not a POC metric. Reframe as "prove that Y% of capacity moves to
  the agent", and defer the headcount conversation to the pilot.

## I. Language and audience

- **Internal material is in English**: recipe pages, architecture boards, POC templates meant for
  reuse. Say explicitly when a runtime prompt stays in the customer's locale.
- **Customer-facing material is in the customer's language.** Mocks use **real dialogue from
  smoke tests**, never invented lines.
- **A prompt the customer will see is customer-facing.** On some platforms the agent's
  configuration is part of the demo: the prompt, procedures, guidelines and tool descriptions are
  on screen. Then write them in the customer's language from the first draft, not as a translation
  at the end. Code identifiers (tool names, metadata keys, enum values) stay as they are, because
  they must match the code. The recipe page still renders the prompt in English: keep that copy
  as a separate file, mark the customer-language file as the source of truth, and keep them in sync.
  *Why:* a prompt in English on a Portuguese-speaking customer's screen reads as "not built for
  you", and it's the part their compliance team reads first.
- **Localize the deliverable and the grammar together.** Example: in Portuguese, "POC" is
  feminine (*a POC, da POC, esta POC*) because it stands for *prova de conceito*. Check acronym
  gender and agreement in every gendered language.
- **Locale formatting is load-bearing.** Check the platform's default formatting and language
  rules against the customer's locale on day one: thousands and decimal separators, currency
  symbol, date order, "reply in the user's language" defaults. *Why:* a default rule would have
  shown an Argentine bank "$85,810,000.00"; in Argentina the comma is the decimal separator.
- **Verify research quotes before they reach anything the customer sees.** A quote, date or
  figure that a research pass got only from a search snippet (it couldn't open the page) stays out
  of scripts and slides until a human has read the source. *Why:* an unverified line attributed to
  the customer's own head of channels nearly became the demo's closing line, in front of him.

## J. Reject on sight (quick table)

| If the user proposes… | Push back with | Because |
|---|---|---|
| "Let's build the app or server from scratch." | Overlay the platform's SDK or starter. The demo is prompt + tools + knowledge + scripts. | Re-implementing it re-earns every solved gotcha. |
| "Ship it without SETUP.md, we'll explain live." | SETUP.md is a required deliverable. | Otherwise nobody else can run it, and the demo isn't done. |
| "Leave it standing after demo day." | Teardown (dry run, then apply). Rebuild is ~30 min. | Limited resources left standing become the next demo's lead time. |
| "Just use the account's master credential." | Use scoped API keys. | Least privilege, rotation, and the platform's own recommendation. |
| "Reuse one agent config across two brands or use cases." | Duplicate it per use case. | Tool descriptions and constraints are use-case-specific. |
| "This mechanism question needs the full 7-tab POC." | Scope a feasibility spike instead. | The 7 tabs exist to produce a Go/No-Go for paid work. |
| "We'll do the risky send for the first time on stage." | Smoke-test it, and wire a plain fallback. | First-time sends on demo day are how error codes reach the stage. |
| "Just ask the AI builder to make the agent from a chat description." | Prompt it from the written spec, with a conflict check and a human diff review (production-path §2). | An unreviewed generation can't be reproduced, diffed or audited. |
| "Show the dashboard numbers, they look real." | Label seeded history as synthetic on stage (§D). | The first follow-up question exposes it, and trust goes with it. |
| "Just tweak their existing guidelines so ours fit." | Add ours and adapt ours (§E: additive only). | It isn't our config to change, and an edit there quietly changes every other flow that uses it. |
| "Quote what their exec said in the press, the research found it." | Read the source first; snippet-only quotes stay out (§I). | A misattributed quote, said to the person it's attributed to, ends the meeting. |
| "Bulk-close everything on the shared sender." | Select by our own markers, with a named target. | §E: closed is final, and other teams live there too. |
