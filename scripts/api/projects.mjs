#!/usr/bin/env node
// Projects REST API. Docs: https://launchdarkly.com/docs/api/projects
// Usage: node scripts/api/projects.mjs list | get <key> | create <key> "<name>" | delete <key>
import { get, post, del, show, args } from './_client.mjs';

const { command, rest } = args();

async function main() {
  switch (command) {
    case 'list':
      return show('projects', await get('/projects'));
    case 'get':
      return show('project', await get(`/projects/${rest[0]}`));
    case 'create':
      // A new project auto-creates Test + Production environments.
      return show('created', await post('/projects', {
        key: rest[0],
        name: rest[1] || rest[0],
        tags: ['demo'],
      }));
    case 'delete':
      return show('deleted', await del(`/projects/${rest[0]}`));
    default:
      console.log('projects.mjs — list | get <key> | create <key> "<name>" | delete <key>');
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
