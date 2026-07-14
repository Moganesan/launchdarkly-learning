#!/usr/bin/env node
// Webhooks REST API (outbound integrations). Docs: https://launchdarkly.com/docs/api/webhooks
// Usage:
//   node scripts/api/webhooks.mjs list
//   node scripts/api/webhooks.mjs create <https-url>
//   node scripts/api/webhooks.mjs delete <id>
import { get, post, del, show, args } from './_client.mjs';

const { command, rest } = args();

async function main() {
  switch (command) {
    case 'list':
      return show('webhooks', await get('/webhooks'));
    case 'create':
      // Fires on any change in your account (flags, segments, etc.).
      return show('created', await post('/webhooks', {
        url: rest[0],
        sign: false,
        on: true,
        name: 'demo-webhook',
        tags: ['demo'],
      }));
    case 'delete':
      return show('deleted', await del(`/webhooks/${rest[0]}`));
    default:
      console.log('webhooks.mjs — list | create <https-url> | delete <id>');
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
