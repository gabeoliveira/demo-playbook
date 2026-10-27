# Demo Playbook

A portable method for building **conversational-AI customer demos and POCs** with an AI coding
agent (Claude Code). It covers the story shape that lands, the draft-first build process, the
deliverables that make a demo runnable by someone else, the lifecycle discipline that makes it
cheap to rebuild, and the POC framework that turns an engagement into a decision.

It is **platform-neutral on purpose**. Everything platform-specific lives in two slots you fill
in for whatever stack you're on: [`PRODUCT_MAP.md`](PRODUCT_MAP.md) (which product plays which
role in the story) and `PLATFORM_NOTES.md` (the gotchas you learn the hard way, started from
[`templates/PLATFORM_NOTES.template.md`](templates/PLATFORM_NOTES.template.md)).

Distilled from roughly two dozen customer demos and POCs (2025–2026), and written from general
know-how. It contains no product internals, customer names, code or credentials from a previous
employer, by design.

## What's inside

| Path | What it is |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Drop-in user-level instructions for Claude Code: who I am, how I like to work, the non-negotiables. |
| [`AGENTS.md`](AGENTS.md) | The same rules, agent-neutral. Devin (and other tools that read `AGENTS.md`) loads it as an always-on rule. |
| [`.claude-plugin/`](.claude-plugin/) · [`.devin-plugin/`](.devin-plugin/) | Plugin manifests for Claude Code and Devin. Same name and version, enforced by the check script. |
| [`skills/build-demo/`](skills/build-demo/SKILL.md) | `/build-demo`: the demo driver (story arc, draft-first process, deliverables, SETUP spec). |
| [`skills/frame-poc/`](skills/frame-poc/SKILL.md) | `/frame-poc`: the 7-tab POC framework plus metric-trap reframes, and the smaller feasibility-spike variant. |
| [`reference/principles.md`](reference/principles.md) | The guardrails: rules that each started as a real correction. |
| [`reference/prompt-skeleton.md`](reference/prompt-skeleton.md) | Annotated system-prompt skeleton. |
| [`reference/artifacts.md`](reference/artifacts.md) | Specs for the recipe page, architecture board, journey walkthrough, builder prompts (production build and no-code recreation) and the branded session plan. |
| [`reference/demo-formats.md`](reference/demo-formats.md) | 15, 30, 60 and 120-minute formats: the live journey first, then the dashboard ladder (agent experience → AI builder → analytics → guardrails and guidelines → tools → rest of platform). |
| [`reference/production-path.md`](reference/production-path.md) | From a written spec to a live agent: route each artifact deterministically, the gates, publish at 0% and ramp, rollback. |
| [`PRODUCT_MAP.md`](PRODUCT_MAP.md) | Capability → product slots. **Fill during onboarding.** |
| [`templates/`](templates/) | DEMO_SCRIPT, SETUP, sequence diagram, POC tabs, PLATFORM_NOTES, and a generic `lifecycle.ts` stage runner. |
| [`memory/working-style.md`](memory/working-style.md) | Preferences and lessons to seed a fresh Claude memory. |
| [`scripts/check-plugin.ts`](scripts/check-plugin.ts) | `node scripts/check-plugin.ts`: manifests in sync, skills portable (no `${CLAUDE_PLUGIN_ROOT}` paths, every mentioned file exists), non-negotiables identical in both instruction files. Runs in CI. |

## Install on a new machine

```bash
# 1. Put this folder somewhere permanent (private git repo recommended)
git clone <your-private-repo-url> ~/demo-playbook

# 2. User-level instructions (applies to every project)
cp ~/demo-playbook/CLAUDE.md ~/.claude/CLAUDE.md      # or append if you already have one
```

Then, inside Claude Code:

```
/plugin marketplace add ~/demo-playbook
/plugin install demo-playbook@demo-playbook
/build-demo        # should now be available, and so should /frame-poc
```

Seed the new memory: open a session and say *"Read ~/demo-playbook/memory/working-style.md and
save the relevant parts to memory."*

### In Devin

Devin reads the same `skills/` folder and its own manifest in `.devin-plugin/`. `AGENTS.md` comes along
as an always-on rule, so there's nothing to copy by hand.

```bash
devin plugins install gabeoliveira/demo-playbook        # personal scope, from GitHub
devin plugins install --local ~/demo-playbook           # or a local checkout, this machine only
```

In the Devin app: **Settings → Plugins → Add plugin → From repository**, then `gabeoliveira/demo-playbook`.
An org admin can install it at organization scope instead. Devin must be able to reach the repo
through your Git integration. The skills show up as `/demo-playbook:build-demo` and
`/demo-playbook:frame-poc`.

Skill files refer to the playbook's files by their path from the plugin root (`reference/…`,
`templates/…`, `PRODUCT_MAP.md`), so the same text works in both tools.

## First week on a new platform

1. **Fill [`PRODUCT_MAP.md`](PRODUCT_MAP.md).** For each capability, record the product that
   plays the role, how a demo provisions it, and what's account-limited. Answer the onboarding
   questions in the table.
2. **Start `PLATFORM_NOTES.md`** from the template, in this repo or in the team's demo repo.
   Every gotcha that costs you more than an hour goes there.
3. **Build one internal demo end-to-end** with `/build-demo`, including SETUP.md and the
   provision/teardown pair. That demo becomes the seed you copy for every customer demo after it.
4. **Retire the generic parts as you go.** Once the map is filled, the skills become specific
   to the new platform without losing the story.

## Maintaining it

When a demo teaches you something that would have saved an hour, add it the same day:

- A platform quirk goes in `PLATFORM_NOTES.md`.
- A rule that holds on any platform goes in `reference/principles.md`.
- A process change goes in the relevant `SKILL.md`.

Then bump `version` in **both** `.claude-plugin/plugin.json` and `.devin-plugin/plugin.json`, and run
`node scripts/check-plugin.ts` (CI runs it too). If you change a non-negotiable, change it in both
`CLAUDE.md` and `AGENTS.md`. The point is that the work compounds.
