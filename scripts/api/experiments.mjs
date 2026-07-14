#!/usr/bin/env node
// Experiments REST API. Docs: https://launchdarkly.com/docs/api/experiments
// Usage:
//   node scripts/api/experiments.mjs list
//   node scripts/api/experiments.mjs create <flag-key> <metric-key> "<name>"
//   node scripts/api/experiments.mjs get    <experiment-key>
import { get, post, show, args, PROJECT, ENVIRONMENT } from './_client.mjs';

const { command, rest } = args();
const base = `/projects/${PROJECT}/environments/${ENVIRONMENT}/experiments`;

async function main() {
  switch (command) {
    case 'list':
      return show('experiments', await get(base));
    case 'get':
      return show('experiment', await get(`${base}/${rest[0]}`));
    case 'create': {
      const [flagKey, metricKey, name] = rest;
      // Create an experiment on a flag, measuring a metric, with two treatments.
      const body = {
        key: `${flagKey}-experiment`,
        name: name || `${flagKey} experiment`,
        iteration: {
          hypothesis: 'The new variation improves the metric.',
          canReshuffleTraffic: true,
          flagKey,
          primarySingleMetricKey: metricKey,
          treatments: [
            { name: 'Control',   baseline: true,  allocationPercent: '50', parameters: [{ flagKey, variationId: 0 }] },
            { name: 'Treatment', baseline: false, allocationPercent: '50', parameters: [{ flagKey, variationId: 1 }] },
          ],
        },
      };
      return show('created experiment', await post(base, body));
    }
    default:
      console.log('experiments.mjs — list | get <key> | create <flag-key> <metric-key> "<name>"');
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
