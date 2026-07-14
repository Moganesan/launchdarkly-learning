#!/usr/bin/env node
// Environments REST API. Docs: https://launchdarkly.com/docs/api/environments
// Usage: node scripts/api/environments.mjs list | get <env> | create <env> "<name>" <color> | delete <env>
import { get, post, del, show, args, PROJECT } from './_client.mjs';

const { command, rest } = args();

async function main() {
  switch (command) {
    case 'list':
      return show('environments', await get(`/projects/${PROJECT}/environments`));
    case 'get':
      return show('environment', await get(`/projects/${PROJECT}/environments/${rest[0]}`));
    case 'create':
      // POST /projects/{proj}/environments
      return show('created', await post(`/projects/${PROJECT}/environments`, {
        key: rest[0],
        name: rest[1] || rest[0],
        color: (rest[2] || '417505').replace('#', ''),
        tags: ['demo'],
      }));
    case 'delete':
      return show('deleted', await del(`/projects/${PROJECT}/environments/${rest[0]}`));
    default:
      console.log('environments.mjs — list | get <env> | create <env> "<name>" <hexcolor> | delete <env>');
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
