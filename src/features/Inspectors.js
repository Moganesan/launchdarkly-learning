// SDK → Features → Inspectors.
//
// Inspectors are registered at init and let you observe SDK internals:
// every flag evaluation ('flag-used'), flag detail changes
// ('flag-detail-changed'), identity changes, and client init. This page
// subscribes to the shared inspectorLog that ldProvider.js feeds.
import React, { useEffect, useState } from 'react';
import { useFlags, useLDClient } from '@launchdarkly/react-sdk';
import { Page, Panel, Code, Button, Badge } from '../components/ui';
import { inspectorLog } from '../lib/ldProvider';

export default function Inspectors() {
  const [entries, setEntries] = useState([]);
  const flags = useFlags();
  const ldClient = useLDClient();

  useEffect(() => inspectorLog.subscribe((e) => {
    setEntries((prev) => [e, ...prev].slice(0, 60));
  }), []);

  // Touch a flag to generate a 'flag-used' inspector callback.
  function evaluate() {
    ldClient?.boolVariation('release-banner', false);
    ldClient?.stringVariation('theme-color', '#000');
  }

  return (
    <Page
      title="Inspectors"
      subtitle="Observe every flag evaluation and change as the SDK sees it."
      docPath="sdk/features/inspectors"
    >
      <Panel title="Live inspector feed">
        <div className="btn-row">
          <Button onClick={evaluate}>Trigger evaluations</Button>
          <Button tone="secondary" onClick={() => setEntries([])}>Clear</Button>
        </div>
        {entries.length === 0 ? (
          <p className="hint">
            Interact with the app (or click above). Every evaluation fires a
            <code> flag-used</code> inspector; dashboard changes fire{' '}
            <code>flag-changed</code>.
          </p>
        ) : (
          <ul className="event-log">
            {entries.map((e, i) => (
              <li key={i}>
                <Badge tone={e.kind === 'flag-changed' ? 'ok' : 'neutral'}>
                  {e.kind}
                </Badge>{' '}
                <strong>{e.flagKey}</strong> = <code>{JSON.stringify(e.value)}</code>
                {e.reason && <> · {e.reason.kind}</>}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Currently loaded flags">
        <Code lang="json">{JSON.stringify(flags, null, 2)}</Code>
      </Panel>

      <Panel title="How inspectors are registered">
        <Code>{`createLDReactProvider(clientSideID, context, {
  ldOptions: {
    inspectors: [
      { type: 'flag-used', name: 'my-eval-logger',
        method: (flagKey, detail) => log(flagKey, detail.value) },
      { type: 'flag-detail-changed', name: 'my-change-logger',
        method: (flagKey, detail) => log('changed', flagKey) },
      // Other inspector types: 'client-identity-changed'
    ],
  },
});`}</Code>
      </Panel>
    </Page>
  );
}
