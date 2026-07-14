// SDK → Features → Bootstrapping.
//
// Bootstrapping seeds the SDK with initial flag values so the very first render
// has real values instead of defaults (no "flash of default content"). Three
// modes: an object (from a server-side allFlagsState), the string
// 'localStorage' (cache across visits), or nothing (fetch on init).
import React from 'react';
import { Page, Panel, Code, Value } from '../components/ui';
import { OFFLINE_BOOTSTRAP, IS_OFFLINE } from '../lib/config';

export default function Bootstrap() {
  // Peek at what the SDK stashed in localStorage in live mode.
  let cached = null;
  try {
    const raw = Object.keys(localStorage).find((k) => k.startsWith('ld:'));
    cached = raw ? { key: raw, value: JSON.parse(localStorage.getItem(raw)) } : null;
  } catch (_) {}

  return (
    <Page
      title="Bootstrapping"
      subtitle="Seed the SDK with initial values so the first render is correct."
      docPath="sdk/features/bootstrapping"
    >
      <Panel title="This app's bootstrap config">
        <p>
          In {IS_OFFLINE ? 'offline' : 'live'} mode this app boots with{' '}
          <code>{IS_OFFLINE ? 'an object bootstrap' : "bootstrap: 'localStorage'"}</code>.
        </p>
        {IS_OFFLINE ? (
          <Code lang="json">{JSON.stringify(OFFLINE_BOOTSTRAP, null, 2)}</Code>
        ) : (
          <Value label="localStorage cache" value={cached || '(none yet)'} />
        )}
      </Panel>

      <Panel title="Three bootstrap modes">
        <Code>{`// 1. Object bootstrap — best for SSR. The server evaluates flags and
//    injects them, so the browser's first paint uses real values.
asyncWithLDProvider({
  clientSideID, context,
  options: { bootstrap: window.__LD_BOOTSTRAP__ },
});

// 2. localStorage — cache the last-known flags across page loads.
asyncWithLDProvider({
  clientSideID, context,
  options: { bootstrap: 'localStorage' },
});

// 3. No bootstrap — SDK fetches on init (brief default-value window).
asyncWithLDProvider({ clientSideID, context });`}</Code>
      </Panel>

      <Panel title="Server → client handoff (SSR)">
        <Code>{`// server (Node SDK):
const state = await ldClient.allFlagsState(context, { clientSideOnly: true });
res.send(\`<script>window.__LD_BOOTSTRAP__=\${JSON.stringify(state.toJSON())}</script>\`);

// browser: pass window.__LD_BOOTSTRAP__ as the bootstrap option above.`}</Code>
      </Panel>
    </Page>
  );
}
