# Server-side (Node) SDK + AI SDK

Package: **`@launchdarkly/node-server-sdk` v9**. Runnable example:
[`scripts/server/evaluate.mjs`](../scripts/server/evaluate.mjs) — it works with
**no account** using the built-in TestData source.

Docs: <https://launchdarkly.com/docs/sdk/server-side/node-js>

## Lifecycle

```js
import * as ld from '@launchdarkly/node-server-sdk';
const client = ld.init(process.env.LD_SDK_KEY);
await client.waitForInitialization({ timeout: 5 });
// … evaluate …
await client.flush();
await client.close();
```

## Typed variations (context is explicit)

```js
await client.boolVariation('flag', context, false);
await client.numberVariation('flag', context, 0);
await client.stringVariation('flag', context, 'x');
await client.jsonVariation('flag', context, {});
await client.boolVariationDetail('flag', context, false); // + reason
```

## allFlagsState → browser bootstrap

```js
const state = await client.allFlagsState(context, { clientSideOnly: true });
res.send(`<script>window.__LD_BOOTSTRAP__=${JSON.stringify(state.toJSON())}</script>`);
```

The browser then passes `window.__LD_BOOTSTRAP__` as the `bootstrap` option —
eliminating the flash of default values on first paint.

## Secure mode

```js
const hash = client.secureModeHash(context); // HMAC of context key with SDK key
// pass `hash` to the browser SDK options to stop context spoofing
```

## TestData source (no network, great for tests)

```js
const td = new ld.integrations.TestData();
td.update(td.flag('release-banner').booleanFlag().on(true));
td.update(td.flag('items-per-page').valueForAll(25));
td.update(
  td.flag('beta-checkout').variations(true, false)
    .fallthroughVariation(1)
    .ifMatch('user', 'plan', 'enterprise').thenReturn(0) // (contextKind, attribute, ...values)
);
const client = ld.init('test-key', { updateProcessor: td.getFactory(), sendEvents: false });
```

Verified output from the example script:

```
boolVariation   release-banner  = true
numberVariation items-per-page  = 25
boolVariation   beta-checkout   = true   (RULE_MATCH for plan=enterprise)
```

## AI SDK + AI Configs

Packages: `@launchdarkly/server-sdk-ai` over the node server SDK. Example:
[`scripts/ai/generate.mjs`](../scripts/ai/generate.mjs). See
[ai-configs.md](./ai-configs.md) for the full picture.

```js
import { init } from '@launchdarkly/node-server-sdk';
import { initAi } from '@launchdarkly/server-sdk-ai';

const aiClient = initAi(init(process.env.LD_SDK_KEY));
const cfg = await aiClient.config('support-assistant', context, defaults, variables);
const result = await cfg.tracker.trackMetricsOf(() =>
  anthropic.messages.create({ model: cfg.model.name, messages: cfg.messages })
);
// tracker auto-records tokens, latency, and success to LaunchDarkly.
```

## Migrations & offline

- **Migrations:** `client.migrationVariation(...)` + `createMigration(...)` drive
  the six-stage data-migration workflow (off → dualwrite → shadow → live →
  rampdown → complete).
- **Offline:** server SDKs accept `{ offline: true }` to serve fallback values
  with no network.
- **File data source:** `ld.integrations.FileDataSourceFactory` reads flags from
  local JSON/YAML for local dev.
