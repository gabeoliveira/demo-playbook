---
name: frame-poc
description: Frame a customer proof-of-concept so the deliverable is a DECISION (Go / Iterate / No-Go), not "we built some code". Uses the 7-tab framework (Charter → Prerequisites → Criteria → Scenarios → Execution → Scorecard → Exit) for paid engagements, or a lighter feasibility spike for mechanism questions. Includes the metric-trap reframes (contention %, single-number latency, zero hallucination, better-than-human) that keep a brief from setting the POC up to fail on paper. Use when scoping a "prove it or reject it" engagement. NOT for demos (use build-demo) or design docs.
---

# Frame a POC

A POC exists to produce a **decision**. Every document chains toward the verdict in Tab 06. If a
section doesn't feed the verdict, cut it.

## Load first

Paths in this file are relative to the plugin's root folder: two levels up from this file.
In Claude Code that folder is `${CLAUDE_PLUGIN_ROOT}`. In Devin, it's the installed plugin's folder.

- `reference/principles.md`: §H (metric traps) and §I (language). Apply §H
  **before** writing the Charter.
- `PRODUCT_MAP.md`: the products whose criteria you'll write.
- `templates/poc-tabs.template.md`: a skeleton for all 7 tabs.

## Pick the size before writing anything

- **Paid POC → the 7 tabs.** It has a client, a defined question, and a Go/No-Go that decides
  whether a production build happens.
- **Feasibility spike → NOT the 7 tabs.** This is a mechanism question the team must answer before
  it can even propose paid work ("can X nest 3 levels deep?", "does Y re-deliver after Z?"). Ship:
  - a README with the question, the candidate mechanisms in an honest trade-off table, and a
    recommendation *before* testing
  - a SETUP with smoke-test **transcripts** and a symptom→fix table for each scenario
  - lifecycle scripts (`provision` / `teardown` / `reset` / `trace`)
  - **explicit pass/fail criteria Q1–Qn** that the live run settles

  Say what was validated statically and what was verified live. If the spike grows into paid
  work, wrap it in the 7 tabs then: the README becomes Charter §1, and the Q-list becomes
  hypotheses.

## Don't start from scratch

Copy the nearest previous client's tabs and adapt them.

- **Rarely change:** the tab structure, the assessment methodology (human labeling, a gold-question
  bank, controlled measurement), and the scenario format.
- **Always change:** the business objective, the use cases in scope, the pre-POC blocking
  decisions, the handoff and channel architecture, the rollout mechanism, the milestones, and the
  named contacts.

## The 7 tabs (always this order, numbered 00–06)

| # | Tab | Role |
|---|---|---|
| 00 | **Charter** | Business objective, use cases in scope, **numbered hypotheses H1–H5**, pre-POC blocking decisions, roles, milestones, long-term vision (captured, not measured). The anchor. |
| 01 | **Prerequisites** | Gate to execution. Each item is marked ⛔ blocking or 🟡 needed for a criterion. Ends with a readiness checklist; execution doesn't start until it's green. |
| 02 | **Evaluation criteria** | For each product: **ONE primary metric**, secondary metrics, how it's measured, and the approval threshold. The technical core. |
| 03 | **Test scenarios** | `ID · Objective · Precondition · Steps · Products exercised · Metrics · Expected outcome`, plus a scenario × product matrix. The bridge from abstract to concrete. |
| 04 | **Execution** | A pointer to the external task tracker plus the suggested sequence. Not the tracker itself. |
| 05 | **Scorecard** | **Living.** Measured results vs thresholds: 🟢 hits · 🟡 partial · 🔴 misses · ⚪ not measured. Ship it empty and update it every measurement day. |
| 06 | **Exit and recommendation** | The decision rule, verdict template, resolution per hypothesis, gaps for production, next steps, and lessons for the framework. |

## One primary metric per capability

Typical primaries (use PRODUCT_MAP for the products that play each role):

| Capability | Primary metric |
|---|---|
| Voice runtime | Latency, bucketed by turn type |
| Knowledge / grounding | Groundedness rate |
| Conversation capture / session | Capture reliability |
| Insights / scoring | Accuracy against human labels |
| Memory | Recall quality |
| Agent platform overall | Facilitator value: time-to-build, change velocity |

Secondary metrics matter, but they don't decide.

When the POC gates financial or other sensitive actions, add **identity assurance** as a Tab-02
criterion. It is a criterion, not a demo beat.

## Non-negotiables

1. The POC produces a decision.
2. Hypotheses are numbered and explicit: the Charter lists them, the Scorecard tracks them, the
   Exit resolves them.
3. Prerequisites are a gate.
4. One primary metric per product.
5. Tasks derive from scenarios. Scorecard entries come from scenario results, not opinion.
6. The Scorecard is living, not a retrospective.
7. Every threshold, decision rule and rollout percentage is marked "agree before execution". Never
   leave one implicit.
8. Long-term vision is recorded (Charter §9 / Exit §6) but kept out of this cycle's criteria.

## Metric traps: run §H of principles.md BEFORE the Charter

If a brief contains a number that sounds unreasonable, first ask whether it **describes** a
metric or **targets** one. Disambiguate before you reframe. When it is a real aspirational target,
write a "Central metric + realistic target" section in Charter §1: name the metric in the
client's words, give the industry reference band, and set up the composite that decides.

## Ownership

You draft the first pass. The engagement lead reviews it before it reaches the client. All tabs
are versioned in the repo, which is the source of truth; the client's doc is derived from it.
Lessons from Exit §7 get promoted back into `principles.md`.
