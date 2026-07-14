# Advanced SDK topics

## OpenFeature

LaunchDarkly provides **OpenFeature providers** (.NET, Java, Node, PHP) so you
can code against the vendor-neutral OpenFeature API and back it with
LaunchDarkly. Docs: <https://launchdarkly.com/docs/sdk/openfeature>

```js
import { OpenFeature } from '@openfeature/server-sdk';
import { LaunchDarklyProvider } from '@launchdarkly/openfeature-node-server';

await OpenFeature.setProviderAndWait(new LaunchDarklyProvider(process.env.LD_SDK_KEY));
const client = OpenFeature.getClient();
const show = await client.getBooleanValue('beta-checkout', false, evalContext);
```

## Edge SDKs

Run flag evaluation at the CDN edge with SDKs for **Cloudflare Workers, Vercel,
Fastly, Akamai**. They read flag data from a KV store kept in sync by
LaunchDarkly, so evaluation is local and fast.

## Migrations

Server SDKs include a **migration framework** for safely moving data/traffic
between an old and new system through six stages:
`off → dualwrite → shadow → live → rampdown → complete`, controlled by a
migration flag with `client.migrationVariation(...)` + `createMigration(...)`.

## Relay Proxy

See [observability.md](./observability.md#relay-proxy).

## Offline & secure mode

- **Offline:** server SDKs take `{ offline: true }`; client SDKs bootstrap with
  `streaming:false, sendEvents:false`.
- **Secure mode:** server computes `secureModeHash(context)`; browser passes it
  as `hash` to prevent context spoofing.

## Test data & file sources

- **TestData** — programmable in-memory flags for tests (see
  [server-sdk.md](./server-sdk.md)).
- **File data source** — read flags from local JSON/YAML for local dev without a
  connection.

## Automatic environment attributes, data saving, private attributes

- **Auto environment attributes** — mobile/browser SDKs can auto-add OS, app
  version, device info to contexts.
- **Data saving mode** — reduce payload sizes on constrained networks.
- **Private attributes** — redact PII from what LaunchDarkly stores (per-context
  `_meta.privateAttributes` or global `allAttributesPrivate`).
