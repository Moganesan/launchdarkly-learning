// LaunchDarkly provider bootstrap — v4 (@launchdarkly/react-sdk).
//
// v4 replaces v3's async `asyncWithLDProvider` with the SYNCHRONOUS factory
// `createLDReactProvider(clientSideID, context, options)`. Initialization state
// is surfaced through the `useInitializationStatus()` hook instead of awaiting
// the provider.
//
// v4 option placement (different from v3!):
//   - client tuning (sendEvents, withReasons, inspectors, logger, private
//     attributes) → options.ldOptions   (LDReactClientOptions extends LDOptions)
//   - flag-key camelCasing               → options.ldOptions.useCamelCaseFlagKeys
//   - initial flag values                → options.bootstrap  (top-level)
//   - streaming is the default connection mode; there is no `streaming: true`
//     boolean. Offline is achieved by bootstrapping + not sending events.
//
// Docs: SDK → Client-side → React → React Web SDK; SDK → Features → SDK
// configuration / Inspectors / Bootstrapping.

import { createLDReactProvider } from '@launchdarkly/react-sdk';
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
// (Docs: SDK → Features → Inspectors.)
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

// Build the React provider component (v4 factory is synchronous).
export function buildLDProvider() {
  // Client tuning shared by both modes. In offline mode we don't send events;
  // bootstrap (below) supplies the flag values so no network is needed.
  const ldOptions = {
    sendEvents: !IS_OFFLINE, // analytics + evaluation events (for experimentation)
    withReasons: true, // include evaluation reasons — powers *VariationDetail
    inspectors, // observe evaluations + changes in the UI
    logger: consoleLogger(),
    // Keep flag keys camelCased (release-banner → releaseBanner).
    useCamelCaseFlagKeys: true,
  };

  return createLDReactProvider(
    IS_OFFLINE ? 'offline-demo' : LD_CLIENT_ID,
    userContext,
    {
      ldOptions,
      // Top-level bootstrap: an object seeds every flag (offline mock); in live
      // mode we let the SDK fetch/stream, so no bootstrap object is passed.
      ...(IS_OFFLINE ? { bootstrap: OFFLINE_BOOTSTRAP } : {}),
    },
  );
}

// The v4 provider is created once, synchronously, at module load.
export const LDProvider = buildLDProvider();
