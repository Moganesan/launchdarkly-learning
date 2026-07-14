// SDK → Features → Subscribing to flag changes + Streaming.
//
// The client emits events when flags change. In live/streaming mode these fire
// from the server in real time; you can subscribe to a specific flag
// ('change:my-flag') or to all changes ('change'). This page logs them live.
import React, { useEffect, useState } from 'react';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { Page, Panel, Code, Badge } from '../components/ui';
import { IS_OFFLINE } from '../lib/config';

export default function Streaming() {
  const ldClient = useLDClient();
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    if (!ldClient) return;
    // 'change' fires with a map of { flagKey: { current, previous } }.
    const onChange = (settings) => {
      const stamp = new Date().toLocaleTimeString();
      const entries = Object.entries(settings).map(([key, val]) => ({
        key,
        current: val.current,
        previous: val.previous,
        at: stamp,
      }));
      setChanges((c) => [...entries, ...c].slice(0, 50));
    };
    ldClient.on('change', onChange);
    // You can also listen to a single flag: ldClient.on('change:release-banner', cb)
    return () => ldClient.off('change', onChange);
  }, [ldClient]);

  return (
    <Page
      title="Streaming & flag change subscriptions"
      subtitle="React to flag changes in real time via the SDK's event emitter."
      docPath="sdk/features/flag-changes"
    >
      <Panel title="Live changes" tone={IS_OFFLINE ? 'warn' : 'ok'}>
        {IS_OFFLINE ? (
          <p>
            <Badge tone="warn">OFFLINE</Badge> Streaming is disabled. In live
            mode, toggle a flag in the LaunchDarkly dashboard and it appears here
            within a second.
          </p>
        ) : (
          <p>
            <Badge tone="ok">STREAMING ON</Badge> Change a flag in your dashboard
            now — updates stream in below without a refresh.
          </p>
        )}
        {changes.length === 0 ? (
          <p className="hint">No changes observed yet.</p>
        ) : (
          <ul className="event-log">
            {changes.map((c, i) => (
              <li key={i}>
                <code>{c.at}</code> <strong>{c.key}</strong>:{' '}
                <code>{JSON.stringify(c.previous)}</code> →{' '}
                <code>{JSON.stringify(c.current)}</code>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Code">
        <Code>{`const ldClient = useLDClient();

// All flag changes for the current context:
ldClient.on('change', (settings) => {
  // settings = { 'release-banner': { current: true, previous: false }, ... }
});

// A single flag:
ldClient.on('change:release-banner', (current, previous) => { ... });

// Enable/disable streaming explicitly:
ldClient.setStreaming(true);   // open the SSE connection
ldClient.setStreaming(false);  // fall back to polling / on-demand`}</Code>
        <p className="hint">
          Streaming is configured at init with <code>streaming: true</code>. The
          React SDK's <code>useFlags()</code> hook already re-renders on change —
          the <code>on('change')</code> emitter is for imperative side effects
          (analytics, cache busting, feature toggling outside React).
        </p>
      </Panel>
    </Page>
  );
}
