// A checklist of LaunchDarkly feature areas and where each is demonstrated.
import React from 'react';
import { Page, Panel, Badge } from '../components/ui';

// status: 'live' (runnable in-app), 'script' (runnable via /scripts),
// 'doc' (documented, platform/dashboard feature)
const COVERAGE = [
  ['Client-side flag evaluation (useFlags/variation)', 'live', '/variations'],
  ['Typed variations (bool/string/number/json)', 'live', '/typed'],
  ['Evaluation details & reasons', 'live', '/details'],
  ['All flags / allFlagsState', 'live', '/all-flags'],
  ['Contexts: single, multi, anonymous', 'live', '/contexts'],
  ['identify() / changing contexts', 'live', '/contexts'],
  ['Private attributes', 'live', '/contexts'],
  ['Track custom events + metric values', 'live', '/track'],
  ['Flush events', 'live', '/track'],
  ['Streaming & subscribe to changes', 'live', '/streaming'],
  ['Bootstrapping (object / localStorage / SSR)', 'live', '/bootstrap'],
  ['Inspectors (flag-used / changed)', 'live', '/inspectors'],
  ['Logging configuration', 'live', 'ldProvider.js'],
  ['Multiple environments', 'live', '/multi-env'],
  ['SDK status / waitForInitialization', 'live', '/status'],
  ['Offline mode', 'live', '/status'],
  ['Secure mode (hash)', 'doc', '/status'],
  ['Release management / progressive delivery', 'live', '/demo/release'],
  ['Experimentation (A/B/n + metrics)', 'live', '/demo/experiment'],
  ['AI Configs + AI metrics', 'live', '/demo/ai-config'],
  ['Server-side SDK (Node) evaluation', 'script', 'scripts/server'],
  ['AI SDK (config + trackMetricsOf)', 'script', 'scripts/ai'],
  ['REST API: projects', 'script', 'scripts/api/projects.mjs'],
  ['REST API: environments', 'script', 'scripts/api/environments.mjs'],
  ['REST API: flags (CRUD + semantic patch toggle)', 'script', 'scripts/api/flags.mjs'],
  ['REST API: segments (+ big segments)', 'script', 'scripts/api/segments.mjs'],
  ['REST API: metrics', 'script', 'scripts/api/metrics.mjs'],
  ['REST API: experiments', 'script', 'scripts/api/experiments.mjs'],
  ['REST API: approvals / governance', 'script', 'scripts/api/approvals.mjs'],
  ['REST API: members & teams', 'script', 'scripts/api/members.mjs'],
  ['REST API: webhooks', 'script', 'scripts/api/webhooks.mjs'],
  ['REST API: audit log', 'script', 'scripts/api/auditlog.mjs'],
  ['CLI (ldcli) flags/envs/setup/dev-server', 'script', 'scripts/cli'],
  ['Feature flags: targeting rules', 'doc', 'docs/targeting.md'],
  ['Feature flags: prerequisites', 'doc', 'docs/targeting.md'],
  ['Percentage rollouts / guarded releases', 'doc', 'docs/release-management.md'],
  ['Approvals & workflows / scheduling', 'doc', 'docs/governance.md'],
  ['Data Export destinations', 'doc', 'docs/integrations.md'],
  ['Observability & session replay', 'doc', 'docs/observability.md'],
  ['Relay Proxy', 'doc', 'docs/advanced-sdk.md'],
  ['Big Segments', 'doc', 'docs/segments.md'],
  ['SCIM / user provisioning / RBAC', 'doc', 'docs/governance.md'],
  ['Integrations (Slack, Jira, Okta, …)', 'doc', 'docs/integrations.md'],
  ['Code references', 'doc', 'docs/integrations.md'],
  ['OpenFeature provider', 'doc', 'docs/advanced-sdk.md'],
];

const TONE = { live: 'ok', script: 'neutral', doc: 'warn' };
const LABEL = { live: 'LIVE IN APP', script: 'RUNNABLE SCRIPT', doc: 'DOCUMENTED' };

export default function Coverage() {
  const counts = COVERAGE.reduce((a, [, s]) => {
    a[s] = (a[s] || 0) + 1;
    return a;
  }, {});
  return (
    <Page
      title="Feature coverage map"
      subtitle="Every LaunchDarkly area this project covers, and exactly where."
      docPath="home"
    >
      <Panel title="Summary">
        <div className="btn-row">
          <Badge tone="ok">{counts.live || 0} live in app</Badge>
          <Badge tone="neutral">{counts.script || 0} runnable scripts</Badge>
          <Badge tone="warn">{counts.doc || 0} documented</Badge>
          <Badge tone="ok"><strong>{COVERAGE.length} total areas</strong></Badge>
        </div>
      </Panel>
      <Panel title="Coverage checklist">
        <table className="cov-table">
          <thead><tr><th>Feature area</th><th>Status</th><th>Where</th></tr></thead>
          <tbody>
            {COVERAGE.map(([name, status, where]) => (
              <tr key={name}>
                <td>{name}</td>
                <td><Badge tone={TONE[status]}>{LABEL[status]}</Badge></td>
                <td><code>{where}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Page>
  );
}
