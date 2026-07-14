// LaunchDarkly provider bootstrap.
//
// This wires up the `launchdarkly-react-client-sdk` (v3) using the async
// initializer so the app can `await` a ready client before first render. It
// demonstrates a large slice of client-side SDK *configuration*:
//   - streaming vs polling
//   - event sending / flushing
//   - bootstrapping
//   - private attributes (set on the context, see contexts.js)
//   - inspectors (flag-used / flag-changed hooks)
//   - evaluation reasons (needed for the "evaluation details" hooks)
//   - offline mode fallback when no client-side ID is configured
//
// Docs: SDK → Client-side → React → React Web SDK; SDK → Features → SDK
// configuration / Inspectors / Bootstrapping.

import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { LD_CLIENT_ID, IS_OFFLINE, OFFLINE_BOOTSTRAP } from './config';
import { userContext } from './contexts';

// A shared event bus so any component can observe raw SDK inspector callbacks
// (flag evaluations and flag changes) live in the UI.
export const inspectorLog = {
  listeners: new Set(),
  emit(entry) {
    const stamped = { ...entry, at: Date.now() };
    this.listeners.forEach((fn) => fn(stamped));
  },
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
};

// Inspectors let you observe SDK internals without patching the client.
// There are several inspector kinds; here we register a flag-used inspector and
// a flag-details-changed inspector. (Docs: SDK → Features → Inspectors.)
const inspectors = [
  {
    type: 'flag-used',
    name: 'demo-flag-used',
    method: (flagKey, flagDetail) => {
      inspectorLog.emit({
        kind: 'flag-used',
        flagKey,
        value: flagDetail?.value,
        variationIndex: flagDetail?.variationIndex,
        reason: flagDetail?.reason,
      });
    },
  },
  {
    type: 'flag-detail-changed',
    name: 'demo-flag-changed',
    method: (flagKey, flagDetail) => {
      inspectorLog.emit({
        kind: 'flag-changed',
        flagKey,
        value: flagDetail?.value,
      });
    },
  },
];

// Build the React provider component. Returns a Promise<Component>.
export async function buildLDProvider() {
  // OFFLINE MODE — no network. We hand the SDK a bootstrap map so every flag
  // resolves to a known value and the whole UI is demonstrable with no account.
  if (IS_OFFLINE) {
    return asyncWithLDProvider({
      clientSideID: 'offline-demo',
      context: userContext,
      options: {
        // Bootstrapping with an object skips the initial network fetch.
        bootstrap: OFFLINE_BOOTSTRAP,
        // Don't attempt to reach LaunchDarkly in offline mode.
        streaming: false,
        sendEvents: false,
        // Still run inspectors so the Inspectors page works offline.
        inspectors,
        logger: consoleLogger(),
      },
      // Keep flag keys as-is (kebab-case) OR camelCase them. Default true.
      reactOptions: { useCamelCaseFlagKeys: true },
    });
  }

  // LIVE MODE — connect to LaunchDarkly with a real client-side ID.
  return asyncWithLDProvider({
    clientSideID: LD_CLIENT_ID,
    context: userContext,
    options: {
      // Real-time flag updates over a streaming connection (SSE).
      streaming: true,
      // Send analytics + evaluation events (required for experimentation).
      sendEvents: true,
      // Ask the SDK to include evaluation reasons so *Detail hooks work.
      evaluationReasons: true,
      // Bootstrap from localStorage so repeat visits render instantly and
      // survive brief offline periods. 'localStorage' is a built-in mode.
      bootstrap: 'localStorage',
      // Observe evaluations + changes in the UI.
      inspectors,
      logger: consoleLogger(),
      // How long to wait for init before resolving with cached/default values.
      // (Set via waitForInitialization on the client; provider awaits ready.)
    },
    reactOptions: { useCamelCaseFlagKeys: true },
    // Defer identify so the initial render uses the provided context; the app's
    // ContextSwitcher can call ldClient.identify() later.
    timeout: 5,
  });
}

// A minimal logger matching the SDK's LDLogger shape. Demonstrates
// SDK → Features → Logging configuration.
function consoleLogger() {
  const levels = ['debug', 'info', 'warn', 'error'];
  const out = {};
  for (const level of levels) {
    out[level] = (...args) =>
      // eslint-disable-next-line no-console
      console[level === 'debug' ? 'log' : level]('[LD]', ...args);
  }
  return out;
}
