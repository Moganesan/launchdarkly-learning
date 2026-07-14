#!/usr/bin/env node
// Metrics REST API (the events experiments measure).
// Docs: https://launchdarkly.com/docs/api/metrics
// Usage:
//   node scripts/api/metrics.mjs list
//   node scripts/api/metrics.mjs create <event-key> "<name>" [conversion|numeric]
//   node scripts/api/metrics.mjs delete <metric-key>
import { get, post, del, show, args, PROJECT } from './_client.mjs';

const { command, rest } = args();

async function main() {
  switch (command) {
    case 'list':
      return show('metrics', await get(`/metrics/${PROJECT}`));
    case 'create': {
      const [eventKey, name, kind = 'conversion'] = rest;
      // A "custom" metric keyed to the event your app sends via track().
      const body = {
        key: eventKey,
        name: name || eventKey,
        kind: 'custom',
        eventKey,
        // 'count' = conversion metric; 'numeric' = uses the metricValue arg of track().
        isNumeric: kind === 'numeric',
        unit: kind === 'numeric' ? 'USD' : undefined,
        // success = "up is better" for this metric
        successCriteria: 'HigherThanBaseline',
        tags: ['demo'],
      };
      return show('created metric', await post(`/metrics/${PROJECT}`, body));
    }
    case 'delete':
      return show('deleted', await del(`/metrics/${PROJECT}/${rest[0]}`));
    default:
      console.log('metrics.mjs — list | create <event-key> "<name>" [conversion|numeric] | delete <key>');
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
