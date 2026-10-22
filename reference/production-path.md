# Production path: from a written spec to a live agent

A demo proves the story. Production needs the same agent to arrive on the platform the same way
every time, pass the same checks, and go live in steps you can undo. This file is the method;
the platform's mechanics live in PRODUCT_MAP ("AI builder", "Config-as-code and versioning") and
PLATFORM_NOTES.

The spec stays in our repo: prompt and procedures (in the customer's language when they see them,
principles §I), tool code, tool descriptions, knowledge, signal definitions, and the eval list.
The platform holds the build.

## 0. Additive only

On an account you didn't create, take a read-only inventory first and save it. Everything after
that **adds**: nothing that existed before is edited or deleted (principles §E). The builder's
standing instructions say so too, and every conflict-check fix changes our spec, never theirs.

## 1. Route each artifact by the most deterministic path the platform offers

| Kind of artifact | Preferred route | Why |
|---|---|---|
| Code (tools, shared helpers) | **Git**, in the platform's versioned format | Diffable, reviewable, testable in CI |
| Flat config (guidelines, guardrails, knowledge, monitors) | **Public API**, scripted in `provision` / `teardown` | Idempotent, and teardown owns it |
| Nested definitions the platform says not to hand-write (procedure graphs, flows) | **The platform's AI builder**, prompted from the spec, then reviewed | The builder knows the internal format. Our job is the spec and the gates |
| Anything with no API or format (signal definitions, voice profiles, settings) | **Console**, listed step by step in SETUP | Manual, so it's kept by policy on teardown |

Once the AI builder creates a definition and the platform serializes it into Git, **that file is
the source of truth** for the build. Snapshot it into our repo, so the next change is a reviewed
diff rather than a fresh generation.

## 2. Gates (none skippable)

1. **Format check in CI.** Lint the platform's file rules: naming, one entry point per file, no
   top-level code a UI save would drop, variable names matching the signature. Also check that
   every tool description equals the spec text.
2. **Builder conflict check.** Before the AI builder creates anything, ask it for contradictions
   across the spec, the existing guidelines and guardrails, and the tools. It won't run one unless
   asked. Fix the spec, not the output.
3. **Human diff review.** Someone reads what the builder proposes before it's created.
4. **Golden set.** About 10–25 scenarios covering the forbidden behaviors, each run 3–5 times, with
   the pass-rate target agreed beforehand (85–90% is a common bar). Voice simulations that skip
   audio don't count for voice: add 5–8 real calls.
5. **Verification prompts.** Ask the builder to trace the procedure end to end, list every
   legally sensitive instruction, list every guardrail, and diff against the last version. Save
   the outputs with the release.

## 3. Release

- **Promote through the platform's environments** (workspace → staging → production) by its own
  mechanism: a PR, a push, or a promote button. Ship each tool together with the procedure that
  uses it.
- **Publish at 0% traffic, then ramp.** A common shape: 5–10% for 1–2 h, 25–50% for 4–24 h, then
  100%. Test the new version in single conversations first, through a branch-pinning flag or a
  pinned number or app.
- **Rollback means moving traffic back.** If rollback needs a redeploy, it's too slow for a bad
  release.
- **For a customer go-live**, use the platform's go-live checklist on top of this: escalation
  tested in production, alerts, a fallback procedure, a QA blitz, and a hypercare window. Never
  launch on a Friday.

## 4. Builder prompts are a deliverable

When the platform has an AI builder, the builder prompts are part of the demo, like the prompt
itself. The spec is in `reference/artifacts.md` §4. Write them so a teammate can rebuild the agent
from the spec plus the prompts alone.

## 5. What a demo shows of this

Production readiness is a story beat only for an audience that will run the agent. For them, a
short "how we know it behaves" segment at the end earns its time (principles §A):
- the golden set's pass rate
- one adversarial case
- the version list with its traffic split

Everyone else gets it in the recipe page, not on stage.
