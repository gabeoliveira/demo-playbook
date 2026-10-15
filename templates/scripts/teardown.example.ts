// npm run teardown            → dry run
// npm run teardown -- --apply → execute
import { teardown } from './lifecycle.js';
import { stages } from './stages.example.js';

if (process.argv.includes('--templates')) {
  for (const s of stages) if (s.envKey === 'DEMO_TEMPLATE_ID') delete s.keep;
}

await teardown(stages);
