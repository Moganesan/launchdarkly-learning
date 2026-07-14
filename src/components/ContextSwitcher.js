// Demonstrates SDK → Features → Identifying and changing contexts.
//
// Calling ldClient.identify(context) re-evaluates every flag for the new
// context and re-renders the whole app. This global switcher lets you flip
// between preset contexts and watch flag values change everywhere.
import React, { useState } from 'react';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { CONTEXT_PRESETS } from '../lib/contexts';
import { IS_OFFLINE } from '../lib/config';

export default function ContextSwitcher() {
  const ldClient = useLDClient();
  const [current, setCurrent] = useState('Ada (enterprise user)');
  const [busy, setBusy] = useState(false);

  async function switchTo(name) {
    setCurrent(name);
    if (!ldClient || IS_OFFLINE) return;
    setBusy(true);
    try {
      // identify() returns a promise that resolves once the new flag set for
      // this context has loaded. The whole tree re-renders with fresh values.
      await ldClient.identify(CONTEXT_PRESETS[name]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ctx-switcher">
      <label>Identified context:</label>
      <select
        value={current}
        onChange={(e) => switchTo(e.target.value)}
        disabled={busy}
      >
        {Object.keys(CONTEXT_PRESETS).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      {busy && <span className="ctx-busy">identifying…</span>}
      {IS_OFFLINE && <span className="ctx-offline">offline — identify is a no-op</span>}
    </div>
  );
}
