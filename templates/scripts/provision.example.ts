// npm run provision  →  npx tsx scripts/provision.ts
import { provision } from './lifecycle.js';
import { stages } from './stages.example.js';

await provision(stages, [
  'Submit / poll template approval (non-blocking)',
  'Point the shared sender webhook at the app (record the previous URL first)',
  'Rehearse 3x: npm run reset between runs',
]);
