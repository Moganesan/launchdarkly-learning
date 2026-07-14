#!/usr/bin/env node
// Members & Teams REST API (account admin / RBAC).
// Docs: https://launchdarkly.com/docs/api/account-members
//       https://launchdarkly.com/docs/api/teams
// Usage:
//   node scripts/api/members.mjs members
//   node scripts/api/members.mjs invite <email> [reader|writer|admin]
//   node scripts/api/members.mjs teams
//   node scripts/api/members.mjs create-team <key> "<name>"
//   node scripts/api/members.mjs tokens
import { get, post, show, args } from './_client.mjs';

const { command, rest } = args();

async function main() {
  switch (command) {
    case 'members':
      return show('members', await get('/members'));
    case 'invite':
      // POST /members — bulk invite by email with a base role.
      return show('invited', await post('/members', [{
        email: rest[0],
        role: rest[1] || 'reader',
      }]));
    case 'teams':
      return show('teams', await get('/teams'));
    case 'create-team':
      return show('created team', await post('/teams', {
        key: rest[0],
        name: rest[1] || rest[0],
        description: 'Created by demo',
      }));
    case 'tokens':
      // Access tokens power API automation like these very scripts.
      return show('access tokens', await get('/tokens'));
    case 'roles':
      return show('custom roles', await get('/roles'));
    default:
      console.log('members.mjs — members | invite <email> [role] | teams | create-team <key> "<name>" | tokens | roles');
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
