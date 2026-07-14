#!/usr/bin/env node
// Approvals REST API (governance / change control).
// Docs: https://launchdarkly.com/docs/api/approvals
// Usage:
//   node scripts/api/approvals.mjs list
//   node scripts/api/approvals.mjs request <flag-key> on|off   (request a flag toggle)
//   node scripts/api/approvals.mjs review  <approval-id> approve|decline
import { get, post, show, args, PROJECT, ENVIRONMENT } from './_client.mjs';

const { command, rest } = args();

async function main() {
  switch (command) {
    case 'list':
      // GET /approval-requests
      return show('approval requests', await get('/approval-requests'));
    case 'request': {
      const [flagKey, state] = rest;
      // POST /projects/{proj}/flags/{flag}/environments/{env}/approval-requests
      const body = {
        description: `Please review turning ${flagKey} ${state}`,
        instructions: [{ kind: state === 'on' ? 'turnFlagOn' : 'turnFlagOff' }],
        notifyMemberIds: [],
      };
      return show('requested approval', await post(
        `/projects/${PROJECT}/flags/${flagKey}/environments/${ENVIRONMENT}/approval-requests`,
        body,
      ));
    }
    case 'review': {
      const [id, decision] = rest;
      // POST /approval-requests/{id}/reviews
      return show('reviewed', await post(`/approval-requests/${id}/reviews`, {
        kind: decision === 'approve' ? 'approve' : 'decline',
        comment: 'Reviewed via demo script',
      }));
    }
    default:
      console.log('approvals.mjs — list | request <flag-key> on|off | review <id> approve|decline');
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
