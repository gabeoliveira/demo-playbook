# POC tab skeletons

Split into seven files: `00-charter.md` … `06-exit.md`. If you deliver in another language,
suffix with the locale (for example `-pt-BR.md`) and translate the headings. Keep the numbering.

---

## 00-charter.md

1. **Business objective.** The pain, in the client's words, and the metric that would move.
   - *Central metric + realistic target* (only when the brief has an aspirational number): name
     it, give the industry reference band, and describe the composite that decides.
2. **Use cases in scope**: numbered, with what's explicitly out.
3. **Products under evaluation**, and the role each plays.
4. **Architecture summary**: channel → agent → tools / memory → handoff → insights.
5. **Hypotheses**: H1…H5, each falsifiable and each tied to a Tab-02 criterion.
6. **Pre-POC blocking decisions**: what must be decided before building (hosting, model
   provider, handoff target, rollout mechanism), plus the owner and date for each.
7. **Roles**: named people, client side and ours.
8. **Milestones**: kickoff · prerequisites green · first measurement · scorecard review ·
   verdict.
9. **Long-term vision**: captured here, **not measured** in this cycle.

## 01-prerequisites.md

| # | Prerequisite | Type (⛔ blocking / 🟡 needed for a criterion) | Owner | Due | Status |
|---|---|---|---|---|---|

**Thresholds to agree before execution:** <<list>>

**Readiness checklist.** Execution starts only when every ⛔ item is green.

## 02-criteria.md

For each product:

| Product | Primary metric (ONE) | Secondary metrics | How measured | Approval threshold |
|---|---|---|---|---|

- **Methodology:** human labeling protocol · gold-question bank · controlled measurement
  conditions.
- *Agree before execution:* <<thresholds not yet agreed>>.

## 03-scenarios.md

For each scenario:

> **S1 · <<name>>**
> Objective · Precondition · Steps · Products exercised · Metrics · Expected outcome

**Scenario × product matrix** (✓ where a scenario exercises a product's criterion).

## 04-execution.md

- Link to the task tracker (external).
- Suggested sequence: prerequisites → S1 … Sn → measurement days → scorecard reviews.
- Every task derives from a scenario.

## 05-scorecard.md (living)

Legend: 🟢 hits · 🟡 partial · 🔴 misses · ⚪ not measured

| Criterion | Threshold | Measured | Date | Status | Evidence (scenario run) |
|---|---|---|---|---|---|

| Hypothesis | Status | Notes |
|---|---|---|

## 06-exit.md

1. **Decision rule** (agreed before execution): Go / Iterate / No-Go conditions.
2. **Verdict**: <<Go | Iterate | No-Go>>, in one paragraph.
3. **Per-hypothesis resolution**: H1…H5, with evidence.
4. **Gaps for production.**
5. **Next steps**: owners and dates.
6. **Long-term vision**, carried forward.
7. **Framework lessons**: promote them back into `principles.md`.
