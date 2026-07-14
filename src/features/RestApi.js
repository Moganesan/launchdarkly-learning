// Platform: REST API. Documents the runnable scripts in /scripts/api.
import React from 'react';
import { Page, Panel, Code, Badge } from '../components/ui';

const ENDPOINTS = [
  ['Projects', 'GET/POST /api/v2/projects', 'projects.mjs'],
  ['Environments', 'GET/POST /api/v2/projects/{proj}/environments', 'environments.mjs'],
  ['Feature flags', 'GET/POST /api/v2/flags/{proj}, PATCH …/{key}', 'flags.mjs'],
  ['Flag targeting (semantic patch)', 'PATCH /api/v2/flags/{proj}/{key}', 'flags.mjs (toggle)'],
  ['Segments', 'GET/POST /api/v2/segments/{proj}/{env}', 'segments.mjs'],
  ['Metrics', 'GET/POST /api/v2/metrics/{proj}', 'metrics.mjs'],
  ['Experiments', 'GET/POST /api/v2/projects/{proj}/environments/{env}/experiments', 'experiments.mjs'],
  ['Approvals', 'GET/POST /api/v2/approval-requests', 'approvals.mjs'],
  ['Members', 'GET/POST /api/v2/members', 'members.mjs'],
  ['Teams', 'GET/POST /api/v2/teams', 'members.mjs'],
  ['Webhooks', 'GET/POST /api/v2/webhooks', 'webhooks.mjs'],
  ['Audit log', 'GET /api/v2/auditlog', 'auditlog.mjs'],
];

export default function RestApi() {
  return (
    <Page
      title="REST API automation"
      subtitle="Every major resource group, as runnable Node scripts in /scripts/api."
      docPath="api"
    >
      <Panel title="Auth & base URL">
        <Code>{`Base:   https://app.launchdarkly.com/api/v2   (EU: app.eu…, Fed: app.launchdarkly.us)
Header: Authorization: <your-api-access-token>
        LD-API-Version: 20240415   (pin the API version)

# semantic patch (e.g. toggle a flag) needs a special Content-Type:
Content-Type: application/json; domain-model=launchdarkly.semanticpatch`}</Code>
      </Panel>

      <Panel title="Covered endpoints → script">
        <table className="cov-table">
          <thead><tr><th>Resource</th><th>Endpoint</th><th>Script</th></tr></thead>
          <tbody>
            {ENDPOINTS.map(([name, ep, file]) => (
              <tr key={name}>
                <td><strong>{name}</strong></td>
                <td><code>{ep}</code></td>
                <td><Badge tone="neutral">scripts/api/{file}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Run it">
        <Code lang="bash">{`# fill in .env first (LD_API_TOKEN, LD_PROJECT_KEY, LD_ENVIRONMENT_KEY)
node scripts/api/flags.mjs list
node scripts/api/flags.mjs create   my-new-flag "My new flag"
node scripts/api/flags.mjs toggle    my-new-flag on
node scripts/api/segments.mjs create beta-users
node scripts/api/metrics.mjs create  checkout-completed
node scripts/api/seed.mjs            # creates every demo flag at once`}</Code>
        <p className="hint">
          Without a token the scripts run in <Badge tone="warn">dry-run</Badge>{' '}
          mode and print the exact request they would send.
        </p>
      </Panel>
    </Page>
  );
}
