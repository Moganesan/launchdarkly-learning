// SDK → Features → Context configuration, Anonymous contexts, Private
// attributes, and Identifying/changing contexts.
import React, { useState } from 'react';
import { useLDClient } from '@launchdarkly/react-sdk';
import { Page, Panel, Code, Value, Button, Badge } from '../components/ui';
import {
  userContext,
  anonymousContext,
  multiContext,
  CONTEXT_PRESETS,
} from '../lib/contexts';
import { IS_OFFLINE } from '../lib/config';

export default function Contexts() {
  const ldClient = useLDClient();
  const [active, setActive] = useState(
    () => ldClient?.getContext?.() || userContext
  );

  async function identify(ctx) {
    if (ldClient && !IS_OFFLINE) await ldClient.identify(ctx);
    setActive(ctx);
  }

  return (
    <Page
      title="Contexts & identify"
      subtitle="Single, multi, and anonymous contexts; private attributes; live re-identification."
      docPath="sdk/features/context-config"
    >
      <Panel title="Currently identified context">
        <Code lang="json">{JSON.stringify(active, null, 2)}</Code>
        <div className="btn-row">
          {Object.entries(CONTEXT_PRESETS).map(([name, ctx]) => (
            <Button key={name} tone="secondary" onClick={() => identify(ctx)}>
              identify → {name}
            </Button>
          ))}
        </div>
        {IS_OFFLINE && <p className="hint">Offline: identify updates the UI only.</p>}
      </Panel>

      <Panel title="Single-kind context with attributes">
        <p>
          A <code>user</code> context. Built-in keys (<code>key</code>,{' '}
          <code>name</code>) plus any custom attributes you target on.
        </p>
        <Code lang="json">{JSON.stringify(userContext, null, 2)}</Code>
        <Value label="Private attributes" value={userContext._meta.privateAttributes} />
        <p className="hint">
          <Badge tone="warn">Private attributes</Badge> Values listed in{' '}
          <code>_meta.privateAttributes</code> are used for evaluation but never
          stored by LaunchDarkly. You can also mark attributes private globally
          in SDK config with <code>privateAttributes: ['email']</code> or{' '}
          <code>allAttributesPrivate: true</code>.
        </p>
      </Panel>

      <Panel title="Multi-context (user + organization + device)">
        <p>Evaluate against several entities at once. Rules can target any kind.</p>
        <Code lang="json">{JSON.stringify(multiContext, null, 2)}</Code>
      </Panel>

      <Panel title="Anonymous context">
        <p>
          No PII. With <code>anonymous: true</code> and no key, client-side SDKs
          auto-generate a stable key so the same visitor keeps consistent
          bucketing across a session.
        </p>
        <Code lang="json">{JSON.stringify(anonymousContext, null, 2)}</Code>
      </Panel>

      <Panel title="Identify code">
        <Code>{`const ldClient = useLDClient();

// Change who we're evaluating for. Resolves when new flags have loaded.
await ldClient.identify({
  kind: 'user',
  key: 'user-abc-123',
  name: 'Ada Lovelace',
  plan: 'enterprise',
  _meta: { privateAttributes: ['email'] },
});`}</Code>
      </Panel>
    </Page>
  );
}
