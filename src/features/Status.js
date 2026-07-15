// SDK → Features → Monitoring SDK status, Offline mode, Shutting down,
// Data saving mode, Secure mode.
import React, { useEffect, useState } from 'react';
import { useLDClient } from '@launchdarkly/react-sdk';
import { Page, Panel, Value, Code, Badge } from '../components/ui';
import { IS_OFFLINE } from '../lib/config';

export default function Status() {
  const ldClient = useLDClient();
  const [ready, setReady] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!ldClient) return;
    const log = (name) => () =>
      setEvents((e) => [{ name, at: new Date().toLocaleTimeString() }, ...e].slice(0, 20));
    ldClient.on('ready', () => setReady(true));
    ldClient.on('initialized', log('initialized'));
    ldClient.on('failed', log('failed'));
    ldClient.on('error', log('error'));
    // waitForInitialization resolves/rejects based on init success.
    ldClient.waitForInitialization?.().then(() => setReady(true)).catch(() => {});
  }, [ldClient]);

  return (
    <Page
      title="SDK status, offline & lifecycle"
      subtitle="Monitor readiness, handle offline mode, secure mode, and shutdown."
      docPath="sdk/features/monitoring"
    >
      <Panel title="Client status">
        <Value label="Mode" value={IS_OFFLINE ? 'offline / mock' : 'live'} />
        <Value label="Initialized" value={ready ? 'yes' : 'pending'} />
        <div className="status-badges">
          <Badge tone={ready ? 'ok' : 'warn'}>
            {ready ? 'READY' : 'INITIALIZING'}
          </Badge>
        </div>
      </Panel>

      <Panel title="Lifecycle events">
        {events.length === 0 ? (
          <p className="hint">Listening for ready / initialized / failed / error…</p>
        ) : (
          <ul className="event-log">
            {events.map((e, i) => (
              <li key={i}><code>{e.at}</code> {e.name}</li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Monitoring & lifecycle code">
        <Code>{`// Wait for the client to be ready (Promise-based):
await ldClient.waitForInitialization({ timeout: 5 });

// Or event-based:
ldClient.on('ready',       () => {/* flags available */});
ldClient.on('failed',      (err) => {/* init failed, using defaults */});
ldClient.on('change',      (settings) => {/* live updates */});

// Gracefully flush + close (SPA teardown / server shutdown):
await ldClient.close();`}</Code>
      </Panel>

      <Panel title="Offline mode">
        <p>Client-side offline is achieved by bootstrapping and disabling network:</p>
        <Code>{`createLDReactProvider(clientSideID, context, {
  bootstrap: knownFlags,                 // top-level: seed known values
  ldOptions: { sendEvents: false },       // don't phone home
});
// Server-side SDKs expose an explicit \`offline: true\` option.`}</Code>
      </Panel>

      <Panel title="Secure mode (server-computed hash)">
        <p>
          Secure mode stops end users from impersonating other contexts. The
          server computes an HMAC of the context key with the SDK key and passes
          it to the browser SDK as <code>hash</code>.
        </p>
        <Code>{`// server (Node):
const hash = ldClient.secureModeHash(context);
// browser (v4):
createLDReactProvider(clientSideID, context, { ldOptions: { hash } });`}</Code>
      </Panel>
    </Page>
  );
}
