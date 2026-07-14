// SDK → Features → Tracking custom events + Flushing events.
//
// track(eventKey, data?, metricValue?) records a custom event tied to the
// current context. These events feed LaunchDarkly metrics used by
// experimentation and guarded rollouts.
import React, { useState } from 'react';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { Page, Panel, Code, Button } from '../components/ui';
import { IS_OFFLINE } from '../lib/config';

export default function Track() {
  const ldClient = useLDClient();
  const [log, setLog] = useState([]);

  function emit(eventKey, data, metricValue) {
    if (ldClient && !IS_OFFLINE) {
      // Signature: track(key, data?, metricValue?)
      ldClient.track(eventKey, data, metricValue);
    }
    setLog((l) => [
      { eventKey, data, metricValue, at: new Date().toLocaleTimeString() },
      ...l,
    ]);
  }

  async function flush() {
    if (ldClient && !IS_OFFLINE) await ldClient.flush();
    setLog((l) => [{ eventKey: '⟶ flush()', at: new Date().toLocaleTimeString() }, ...l]);
  }

  return (
    <Page
      title="Track events & metrics"
      subtitle="Record custom events that power experiment and guarded-rollout metrics."
      docPath="sdk/features/events"
    >
      <Panel title="Send events">
        <div className="btn-row">
          <Button onClick={() => emit('button-clicked')}>
            track('button-clicked')
          </Button>
          <Button onClick={() => emit('item-added', { sku: 'A-42', qty: 2 })}>
            track('item-added', {'{ sku, qty }'})
          </Button>
          <Button onClick={() => emit('checkout-completed', { plan: 'pro' }, 49.99)}>
            track('checkout-completed', data, 49.99) — numeric metric
          </Button>
          <Button tone="secondary" onClick={flush}>flush()</Button>
        </div>
        {IS_OFFLINE && (
          <p className="hint">Offline: events are logged locally, not sent.</p>
        )}
      </Panel>

      <Panel title="Event log (this session)">
        {log.length === 0 ? (
          <p className="hint">No events yet — click a button above.</p>
        ) : (
          <ul className="event-log">
            {log.map((e, i) => (
              <li key={i}>
                <code>{e.at}</code> <strong>{e.eventKey}</strong>
                {e.data && <> · data={JSON.stringify(e.data)}</>}
                {e.metricValue != null && <> · metric={e.metricValue}</>}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Code">
        <Code>{`const ldClient = useLDClient();

// Simple conversion event:
ldClient.track('checkout-completed');

// With custom data (available on the event in Data Export):
ldClient.track('item-added', { sku: 'A-42', qty: 2 });

// With a numeric metric value — used by numeric experiment metrics:
ldClient.track('checkout-completed', { plan: 'pro' }, 49.99);

// Force-send queued events immediately (e.g. before page unload):
await ldClient.flush();`}</Code>
        <p className="hint">
          These events become <strong>metrics</strong> in the dashboard, which
          you attach to experiments (see the Experimentation demo) or to guarded
          rollouts for automatic regression detection.
        </p>
      </Panel>
    </Page>
  );
}
