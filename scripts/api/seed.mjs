#!/usr/bin/env node
// One-shot provisioner: creates every flag, segment, and metric the React demo
// app references, so the app lights up with real data against your project.
//
//   node scripts/api/seed.mjs
//
// Idempotent-ish: if a resource already exists LaunchDarkly returns 409; we log
// and continue. In dry-run mode (no LD_API_TOKEN) it prints all requests.
import { post, show, DRY_RUN, PROJECT, ENVIRONMENT } from './_client.mjs';

// Mirrors DEMO_FLAG_KEYS / OFFLINE_BOOTSTRAP in src/lib/config.js.
const FLAGS = [
  { key: 'release-banner', name: 'Release banner', variations: [{ value: true }, { value: false }] },
  { key: 'theme-color', name: 'Theme color', variations: [{ value: '#405BFF' }, { value: '#17A672' }, { value: '#E5484D' }] },
  { key: 'items-per-page', name: 'Items per page', variations: [{ value: 10 }, { value: 25 }, { value: 50 }] },
  { key: 'checkout-config', name: 'Checkout config', variations: [
    { value: { provider: 'stripe', currency: 'USD', express: true, retries: 3 } },
    { value: { provider: 'stripe', currency: 'USD', express: false, retries: 1 } },
  ] },
  { key: 'beta-checkout', name: 'Beta checkout', variations: [{ value: true }, { value: false }] },
  { key: 'ai-model-config', name: 'AI model config', variations: [
    { value: { model: 'claude-opus-4-8', temperature: 0.7, maxTokens: 1024 } },
    { value: { model: 'claude-haiku-4-5-20251001', temperature: 0.3, maxTokens: 512 } },
  ] },
];

const METRICS = [
  { event: 'experiment-conversion', name: 'Experiment conversion', numeric: false },
  { event: 'checkout-completed', name: 'Checkout completed', numeric: true },
];

async function createFlag(f) {
  try {
    await post(`/flags/${PROJECT}`, {
      ...f,
      clientSideAvailability: { usingEnvironmentId: true, usingMobileKey: true },
      tags: ['demo'],
    });
    console.log(`  ✓ flag ${f.key}`);
  } catch (e) {
    console.log(`  • flag ${f.key}: ${e.message.split('\n')[0]}`);
  }
}

async function createMetric(m) {
  try {
    await post(`/metrics/${PROJECT}`, {
      key: m.event, name: m.name, kind: 'custom', eventKey: m.event,
      isNumeric: m.numeric, unit: m.numeric ? 'USD' : undefined,
      successCriteria: 'HigherThanBaseline', tags: ['demo'],
    });
    console.log(`  ✓ metric ${m.event}`);
  } catch (e) {
    console.log(`  • metric ${m.event}: ${e.message.split('\n')[0]}`);
  }
}

async function createSegment() {
  try {
    await post(`/segments/${PROJECT}/${ENVIRONMENT}`, {
      key: 'beta-users', name: 'Beta users', unbounded: false, tags: ['demo'],
    });
    console.log('  ✓ segment beta-users');
  } catch (e) {
    console.log(`  • segment beta-users: ${e.message.split('\n')[0]}`);
  }
}

async function main() {
  console.log(`\nSeeding project="${PROJECT}" env="${ENVIRONMENT}"${DRY_RUN ? ' (DRY RUN)' : ''}`);
  console.log('\nFlags:');   for (const f of FLAGS)   await createFlag(f);
  console.log('\nMetrics:'); for (const m of METRICS) await createMetric(m);
  console.log('\nSegments:'); await createSegment();
  show('done', { flags: FLAGS.length, metrics: METRICS.length, segments: 1 });
  if (!DRY_RUN) console.log('\nNow set REACT_APP_LD_CLIENT_ID and run `npm start`.');
}
main().catch((e) => { console.error(e.message); process.exit(1); });
