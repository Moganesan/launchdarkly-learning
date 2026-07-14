#!/usr/bin/env node
// Audit log REST API (compliance / change history). Docs: https://launchdarkly.com/docs/api/audit-log
// Usage:
//   node scripts/api/auditlog.mjs recent [limit]
//   node scripts/api/auditlog.mjs get <entry-id>
import { get, show, args } from './_client.mjs';

const { command, rest } = args();

async function main() {
  switch (command) {
    case 'recent': {
      const limit = rest[0] || 10;
      const data = await get(`/auditlog?limit=${limit}`);
      const items = (data.items || []).map((e) => ({
        date: e.date, name: e.name, kind: e.kind, member: e.member?.email,
      }));
      return show(`last ${limit} audit entries`, items.length ? items : data);
    }
    case 'get':
      return show('audit entry', await get(`/auditlog/${rest[0]}`));
    default:
      console.log('auditlog.mjs — recent [limit] | get <entry-id>');
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
