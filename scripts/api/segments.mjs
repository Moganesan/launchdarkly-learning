#!/usr/bin/env node
// Segments REST API (standard + big segments).
// Docs: https://launchdarkly.com/docs/api/segments
// Usage:
//   node scripts/api/segments.mjs list
//   node scripts/api/segments.mjs create <key> "<name>"
//   node scripts/api/segments.mjs add    <key> <context-key>      (include an individual)
//   node scripts/api/segments.mjs rule   <key>                    (add a targeting rule)
//   node scripts/api/segments.mjs delete <key>
import { get, post, patch, del, show, args, PROJECT, ENVIRONMENT } from './_client.mjs';

const { command, rest } = args();

async function main() {
  switch (command) {
    case 'list':
      return show('segments', await get(`/segments/${PROJECT}/${ENVIRONMENT}`));
    case 'create':
      // unbounded:false = standard segment; set unbounded:true for a Big Segment
      // (backed by an external store, for very large membership lists).
      return show('created', await post(`/segments/${PROJECT}/${ENVIRONMENT}`, {
        key: rest[0],
        name: rest[1] || rest[0],
        description: 'Created by the LaunchDarkly demo app',
        unbounded: false,
        tags: ['demo'],
      }));
    case 'add':
      // Semantic patch: add an individual context to the segment.
      return show('added member', await patch(
        `/segments/${PROJECT}/${ENVIRONMENT}/${rest[0]}`,
        { instructions: [{ kind: 'addIncludedUsers', values: [rest[1]] }] },
        'semanticPatch',
      ));
    case 'rule':
      // Semantic patch: add a rule (country = GB) so the segment targets by attribute.
      return show('added rule', await patch(
        `/segments/${PROJECT}/${ENVIRONMENT}/${rest[0]}`,
        { instructions: [{
          kind: 'addRule',
          clauses: [{ contextKind: 'user', attribute: 'country', op: 'in', values: ['GB'] }],
        }] },
        'semanticPatch',
      ));
    case 'delete':
      return show('deleted', await del(`/segments/${PROJECT}/${ENVIRONMENT}/${rest[0]}`));
    default:
      console.log('segments.mjs — list | create <key> "<name>" | add <key> <ctx> | rule <key> | delete <key>');
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
