# React (client-side) SDK

This app uses **`launchdarkly-react-client-sdk` v3** (the stable, widely-deployed
package). The newer **`@launchdarkly/react-sdk` v4** API is documented alongside
each feature. Docs: <https://launchdarkly.com/docs/sdk/client-side/react/react-web>

Wiring lives in [`src/lib/ldProvider.js`](../src/lib/ldProvider.js); every feature
below has a live page under `src/features/`.

---

## Initialization

The async initializer lets you `await` a ready client before first render.

```js
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

const LDProvider = await asyncWithLDProvider({
  clientSideID: 'YOUR_CLIENT_SIDE_ID',
  context: { kind: 'user', key: 'user-abc-123', name: 'Ada' },
  options: {
    streaming: true,           // real-time updates over SSE
    sendEvents: true,          // analytics + evaluation events
    evaluationReasons: true,   // needed for variationDetail()
    bootstrap: 'localStorage', // cache flags across visits
    inspectors: [/* … */],     // observe evaluations/changes
    logger: myLogger,
  },
  reactOptions: { useCamelCaseFlagKeys: true },
});

root.render(<LDProvider><App /></LDProvider>);
```

**v4 equivalent** (`@launchdarkly/react-sdk`):

```js
import { createLDReactProvider, useInitializationStatus } from '@launchdarkly/react-sdk';
const LDProvider = createLDReactProvider('client-side-id', { kind: 'user', key: 'u' }, { ldOptions: {...} });
```

## Evaluating flags → [`/variations`](../src/features/Variations.js)

```js
import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';

const { releaseBanner, themeColor, itemsPerPage } = useFlags(); // camelCased keys
const value = useLDClient().variation('release-banner', false); // imperative
```

Four value types: **boolean, string, number, JSON**. v4 adds typed hooks:
`useBoolVariation`, `useStringVariation`, `useNumberVariation`, `useJsonVariation`.

## Evaluation details → [`/details`](../src/features/EvaluationDetails.js)

```js
const { value, variationIndex, reason } = ldClient.variationDetail('release-banner', false);
// reason.kind ∈ OFF | FALLTHROUGH | TARGET_MATCH | RULE_MATCH | PREREQUISITE_FAILED | ERROR
```

Requires `evaluationReasons: true`. v4: `useBoolVariationDetail(...)`.

## All flags → [`/all-flags`](../src/features/AllFlags.js)

```js
const all = ldClient.allFlags(); // the full map for the current context
```

## Contexts & identify → [`/contexts`](../src/features/Contexts.js)

```js
// single-kind
{ kind: 'user', key: 'u', name: 'Ada', plan: 'enterprise',
  _meta: { privateAttributes: ['email'] } }

// multi-context
{ kind: 'multi', user: {...}, organization: {...}, device: {...} }

// anonymous — SDK auto-generates a stable key
{ kind: 'user', anonymous: true }

// re-evaluate for a new context
await ldClient.identify(newContext);
```

**Private attributes:** per-context via `_meta.privateAttributes`, or globally in
options via `privateAttributes: ['email']` / `allAttributesPrivate: true`.

## Track events & metrics → [`/track`](../src/features/Track.js)

```js
ldClient.track('checkout-completed');                       // conversion
ldClient.track('item-added', { sku: 'A-42' });              // + custom data
ldClient.track('checkout-completed', { plan: 'pro' }, 49.99); // + numeric metric
await ldClient.flush();                                       // force-send queue
```

## Streaming & change subscriptions → [`/streaming`](../src/features/Streaming.js)

```js
ldClient.on('change', (settings) => {/* { key: { current, previous } } */});
ldClient.on('change:release-banner', (cur, prev) => {});
ldClient.setStreaming(true);
```

## Bootstrapping → [`/bootstrap`](../src/features/Bootstrap.js)

Three modes: an **object** (from server `allFlagsState`, best for SSR),
`'localStorage'`, or none. See the server→client handoff in
[server-sdk.md](./server-sdk.md).

## Inspectors → [`/inspectors`](../src/features/Inspectors.js)

```js
options: { inspectors: [
  { type: 'flag-used',           name: 'log', method: (k, d) => {} },
  { type: 'flag-detail-changed', name: 'log', method: (k, d) => {} },
]}
```

## Multiple environments → [`/multi-env`](../src/features/MultiEnv.js)

Run several clients (one per project/environment) and read them by alias
(`useFlags('staging')`). v4 uses explicit `createClient` instances + contexts.

## SDK status, offline, secure mode → [`/status`](../src/features/Status.js)

```js
await ldClient.waitForInitialization({ timeout: 5 });
ldClient.on('ready' | 'failed' | 'error' | 'change', cb);
await ldClient.close();               // flush + teardown
// offline: bootstrap + { streaming:false, sendEvents:false }
// secure mode: pass server-computed { hash } into options
```

## Full SDK feature list (from the docs)

SDK configuration · Aliasing · Anonymous contexts · Automatic environment
attributes · Big segments · Bootstrapping · Context configuration · Data saving
mode · Flag evaluation · Evaluation details · Flushing events · Getting all
flags · Hooks · Identifying/changing contexts · Inspectors · Logging · Migrations
· Monitoring status · Multiple environments · Offline mode · OpenTelemetry ·
Private attributes · Reading flags from a file · Relay Proxy · Secure mode ·
Tracking events · Shutting down · Storing data · Subscribing to changes · Test
data sources · Tracking AI metrics · Web proxy.
