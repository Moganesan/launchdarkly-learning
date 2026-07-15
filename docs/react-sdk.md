# React (client-side) SDK

This app uses **`@launchdarkly/react-sdk` v4** — the **current, GA, recommended**
React Web SDK. The older `launchdarkly-react-client-sdk` (v3) is **deprecated**
(*"the project has been renamed `@launchdarkly/react-sdk` and all future releases
will be made from the new repository"*), and is referenced here only for
migration context. Docs:
<https://launchdarkly.com/docs/sdk/client-side/react/react-web>

Wiring lives in [`src/lib/ldProvider.js`](../src/lib/ldProvider.js); every feature
below has a live page under `src/features/`. Requires **React 18+** (19+ for
React Server Components).

---

## Initialization — synchronous factory

v4 replaces v3's async `asyncWithLDProvider` with the **synchronous**
`createLDReactProvider`. You render the provider immediately and read init state
from the `useInitializationStatus()` hook.

```js
import { createLDReactProvider, useInitializationStatus } from '@launchdarkly/react-sdk';

const LDProvider = createLDReactProvider(
  'YOUR_CLIENT_SIDE_ID',
  { kind: 'user', key: 'user-abc-123', name: 'Ada' },
  {
    ldOptions: {                 // client tuning (LDReactClientOptions extends LDOptions)
      sendEvents: true,          // analytics + evaluation events
      withReasons: true,         // include evaluation reasons (was evaluationReasons in v3)
      inspectors: [/* … */],     // observe evaluations/changes
      logger: myLogger,
      useCamelCaseFlagKeys: true, // release-banner → releaseBanner
    },
    bootstrap: 'localStorage',   // TOP-LEVEL in v4 (not inside ldOptions)
  },
);

function App() {
  const { status, error } = useInitializationStatus(); // 'initializing' | 'ready' | 'failed'
  if (status === 'initializing') return <Spinner />;
  return <YourApp />;
}

root.render(<LDProvider><App /></LDProvider>);
```

### v4 option placement (differs from v3!)

| What | v3 | v4 |
|------|----|----|
| Client tuning | `options: {...}` | `ldOptions: {...}` |
| Eval reasons | `evaluationReasons: true` | `withReasons: true` |
| camelCase keys | `reactOptions.useCamelCaseFlagKeys` | `ldOptions.useCamelCaseFlagKeys` |
| Bootstrap | `options.bootstrap` | top-level `bootstrap` |
| Streaming | `streaming: true` boolean | default connection mode (no boolean) |
| Init | `await asyncWithLDProvider(...)` | sync `createLDReactProvider(...)` + `useInitializationStatus()` |

## Evaluating flags → [`/variations`](../src/features/Variations.js)

```js
import { useFlags, useLDClient } from '@launchdarkly/react-sdk';

const { releaseBanner, themeColor } = useFlags(); // camelCased keys
// Imperative TYPED methods (the generic variation() is gone in v4):
const client = useLDClient();
client.boolVariation('release-banner', false);
client.stringVariation('theme-color', 'light');
client.numberVariation('items-per-page', 10);
client.jsonVariation('checkout-config', {});
```

## Typed hooks → [`/typed`](../src/features/TypedVariations.js)

v4's headline feature — single-flag hooks that re-render **only** when that flag
changes:

```js
import {
  useBoolVariation, useStringVariation, useNumberVariation, useJsonVariation,
  useBoolVariationDetail,
} from '@launchdarkly/react-sdk';

const show = useBoolVariation('release-banner', false);
const { value, variationIndex, reason } = useBoolVariationDetail('release-banner', false);
```

> `useFlags()` still exists but is marked **for removal in a future major
> version**; prefer typed hooks in new code.

## Evaluation details → [`/details`](../src/features/EvaluationDetails.js)

Typed `*VariationDetail` methods (client) or `use*VariationDetail` hooks return
`{ value, variationIndex, reason }`. Requires `withReasons: true`. Reason kinds:
`OFF | FALLTHROUGH | TARGET_MATCH | RULE_MATCH | PREREQUISITE_FAILED | ERROR`.

## Contexts & identify → [`/contexts`](../src/features/Contexts.js)

```js
// single / multi / anonymous — same context model as all modern SDKs
{ kind: 'user', key: 'u', name: 'Ada', plan: 'enterprise',
  _meta: { privateAttributes: ['email'] } }
{ kind: 'multi', user: {...}, organization: {...}, device: {...} }
{ kind: 'user', anonymous: true }

await ldClient.identify(newContext); // re-evaluate for a new context
ldClient.getContext();               // current context
```

## Track / flush → [`/track`](../src/features/Track.js)

```js
ldClient.track('checkout-completed', { plan: 'pro' }, 49.99); // key, data?, metricValue?
await ldClient.flush();
```

## Streaming & changes → [`/streaming`](../src/features/Streaming.js)

```js
ldClient.on('change', (settings) => {/* { key: { current, previous } } */});
ldClient.on('change:release-banner', (cur, prev) => {});
ldClient.on('dataSourceStatus', (status) => {}); // connection health
```

Streaming is the default connection mode in v4 — no `streaming: true` flag or
runtime `setStreaming()` toggle.

## Bootstrapping → [`/bootstrap`](../src/features/Bootstrap.js)

Top-level `bootstrap`: an **object** (SSR handoff from server `allFlagsState`),
the string `'localStorage'`, or omit it. See [server-sdk.md](./server-sdk.md).

## Inspectors → [`/inspectors`](../src/features/Inspectors.js)

```js
createLDReactProvider(id, ctx, { ldOptions: { inspectors: [
  { type: 'flag-used',           name: 'log', method: (k, d) => {} },
  { type: 'flag-detail-changed', name: 'log', method: (k, d) => {} },
]}});
```

## Multiple environments → [`/multi-env`](../src/features/MultiEnv.js)

v4 uses explicit clients + per-client React contexts:

```js
import { initLDReactContext, createClient, useBoolVariation } from '@launchdarkly/react-sdk';
const ProdCtx = initLDReactContext();
const prodClient = createClient('prod-id', { kind: 'user', key: 'u' });
prodClient.start();
const inProd = useBoolVariation('my-feature', false, ProdCtx);
```

## Status / offline / secure mode → [`/status`](../src/features/Status.js)

```js
await ldClient.waitForInitialization({ timeout: 5 }); // or useInitializationStatus()
await ldClient.close();
// offline: top-level bootstrap + ldOptions { sendEvents: false }
// secure mode: ldOptions { hash } (server computes secureModeHash(context))
```

## React Server Components (v4, React 19+)

```tsx
import { init } from '@launchdarkly/node-server-sdk';
import { createLDServerSession } from '@launchdarkly/react-sdk/server';

const base = init(process.env.LAUNCHDARKLY_SDK_KEY);
const session = createLDServerSession(base, { kind: 'user', key: 'u' });
const show = await session.boolVariation('show-new-feature', false);
```

## Migrating v3 → v4 (cheat sheet)

1. `npm i @launchdarkly/react-sdk && npm rm launchdarkly-react-client-sdk`
2. `asyncWithLDProvider(...)` → `createLDReactProvider(id, ctx, opts)` (sync)
3. Move client options under `ldOptions`; move `bootstrap` to top level.
4. `evaluationReasons` → `withReasons`.
5. `variation()` / `variationDetail()` → typed `boolVariation()` /
   `boolVariationDetail()` etc. (no context arg).
6. Gate rendering on `useInitializationStatus()` instead of awaiting the provider.
7. Prefer `useBoolVariation` etc. over `useFlags`.
