// node scripts/check-plugin.ts   (Node 22.18+ / 24 runs TypeScript directly; no dependencies)
//
// Keeps the playbook installable in both Claude Code and Devin:
//   1. .claude-plugin/plugin.json and .devin-plugin/plugin.json agree on name and version, the
//      name fits Devin's rule, and marketplace.json lists the same plugin.
//   2. Every skills/<name>/SKILL.md has frontmatter with that name and a description.
//   3. Skills don't depend on ${CLAUDE_PLUGIN_ROOT} for paths (Devin doesn't expand it in skill
//      text), and every plugin-root path they mention exists.
//   4. AGENTS.md (agent-neutral) and CLAUDE.md (first person) list the same non-negotiables.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const json = (p: string) => JSON.parse(read(p));
const problems: string[] = [];
const check = (ok: unknown, msg: string) => {
  if (!ok) problems.push(msg);
};

// 1. Manifests
const claude = json('.claude-plugin/plugin.json');
const devin = json('.devin-plugin/plugin.json');
const market = json('.claude-plugin/marketplace.json');
check(claude.name === devin.name, `name differs: claude "${claude.name}" vs devin "${devin.name}"`);
check(claude.version === devin.version, `version differs: claude ${claude.version} vs devin ${devin.version}`);
check(/^[a-z0-9]+([.-][a-z0-9]+)*$/.test(devin.name), `"${devin.name}" breaks Devin's naming rule (lowercase, single - or . separators)`);
check(/^\d+\.\d+\.\d+$/.test(claude.version), `version "${claude.version}" isn't x.y.z`);
check(market.plugins?.some((p: { name: string }) => p.name === claude.name), `marketplace.json doesn't list "${claude.name}"`);

// 2 + 3. Skills
const skills = readdirSync(join(root, 'skills'), { withFileTypes: true }).filter((d) => d.isDirectory());
check(skills.length > 0, 'no skills/<name>/ directories');
for (const dir of skills) {
  const rel = `skills/${dir.name}/SKILL.md`;
  if (!existsSync(join(root, rel))) {
    problems.push(`${rel} is missing`);
    continue;
  }
  const text = read(rel);
  const front = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
  check(new RegExp(`^name: ${dir.name}$`, 'm').test(front), `${rel}: frontmatter name isn't "${dir.name}"`);
  check(/^description: \S/m.test(front), `${rel}: frontmatter description is missing`);
  const uses = [...text.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\//g)].length;
  check(uses === 0, `${rel}: ${uses} path(s) still start with \${CLAUDE_PLUGIN_ROOT}/ (Devin won't expand it)`);
  for (const [, path] of text.matchAll(/`((?:reference|templates|memory|skills)\/[^`\s]+|PRODUCT_MAP\.md|AGENTS\.md|CLAUDE\.md)`/g)) {
    check(existsSync(join(root, path)), `${rel}: mentions \`${path}\`, which doesn't exist at the plugin root`);
  }
}

// 4. Non-negotiables in both instruction files
const titles = (file: string) =>
  [...read(file).split('## Non-negotiables')[1]?.split('\n## ')[0].matchAll(/^\d+\. \*\*(.+?)\*\*/gm) ?? []].map((m) => m[1]);
const a = titles('AGENTS.md');
const c = titles('CLAUDE.md');
check(a.length === 8, `AGENTS.md lists ${a.length} non-negotiables, expected 8`);
check(JSON.stringify(a) === JSON.stringify(c), `non-negotiables differ:\n  AGENTS.md: ${a.join(' | ')}\n  CLAUDE.md: ${c.join(' | ')}`);

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`✓ demo-playbook ${claude.version}: manifests in sync, ${skills.length} skills portable, non-negotiables match`);
