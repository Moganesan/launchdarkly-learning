# LaunchDarkly — complete feature demo app

A runnable tour of the **entire** LaunchDarkly platform:

- A **React app** genuinely wired to the client-side SDK — 18 pages, one per SDK
  capability, plus release / experimentation / AI-Config product demos.
- **Runnable automation** — 11 REST API wrappers, CLI scripts, a server-side Node
  SDK example, and an AI SDK example.
- **Full documentation** in [`docs/`](./docs/) covering every platform feature,
  each linked back to the official docs.

Built on `launchdarkly-react-client-sdk` (v3) + `@launchdarkly/node-server-sdk`
(v9). Source of truth: <https://launchdarkly.com/docs/home>.

---

## Quick start

### Option A — offline / mock (zero setup)

```bash
npm install
npm start          # → http://localhost:3000
```

Every page renders from a local bootstrap; every script runs in **dry-run** and
prints the exact request it would send. Nothing hits the network. Great for a
first look or a shareable demo.

### Option B — live (real LaunchDarkly account)

```bash
cp .env.example .env
# edit .env: LD_API_TOKEN, LD_SDK_KEY, LD_PROJECT_KEY, LD_ENVIRONMENT_KEY

npm run ld:seed                       # provision all demo flags/metrics/segments
# then set REACT_APP_LD_CLIENT_ID in .env to your environment's client-side ID
npm start
```

Now the app streams live: toggle a flag in your dashboard and watch it update in
`/streaming`, flip the context in the top bar and watch evaluations change.

> `.env` is git-ignored — it holds real secrets. Only `REACT_APP_*` vars reach
> the browser bundle; `LD_SDK_KEY` / `LD_API_TOKEN` are used solely by the
> Node scripts.

---

## What's inside

### React SDK pages (`src/features/`)

| Route | Feature |
|-------|---------|
| `/variations` | `useFlags` / `variation` — all four value types |
| `/details` | `variationDetail` — value + variationIndex + reason |
| `/all-flags` | `allFlags` — full map, bootstrap export |
| `/typed` | typed variation hooks (v4 API + v3 wrappers) |
| `/contexts` | single / multi / anonymous contexts, `identify`, private attrs |
| `/track` | `track` custom events + numeric metrics, `flush` |
| `/streaming` | live `on('change')` subscriptions |
| `/bootstrap` | object / localStorage / SSR bootstrapping |
| `/inspectors` | live flag-used / flag-changed inspector feed |
| `/multi-env` | multiple SDK clients in one app |
| `/status` | init status, offline, secure mode, lifecycle |
| `/demo/release` | progressive delivery & kill switch |
| `/demo/experiment` | A/B/n + conversion metric loop |
| `/demo/ai-config` | AI Configs + AI metrics |
| `/rest-api`, `/cli`, `/coverage` | automation docs + coverage checklist |

### Scripts (`scripts/`)

```bash
# REST API (dry-run without a token)
node scripts/api/seed.mjs                      # provision everything
node scripts/api/flags.mjs   create beta "Beta" bool
node scripts/api/flags.mjs   toggle  beta on          # semantic patch
node scripts/api/flags.mjs   rollout beta 25          # 25% rollout
node scripts/api/segments.mjs  create beta-users "Beta"
node scripts/api/metrics.mjs   create checkout "Checkout" numeric
node scripts/api/experiments.mjs create theme checkout "Test"
node scripts/api/approvals.mjs request beta on
node scripts/api/members.mjs   members
node scripts/api/webhooks.mjs  list
node scripts/api/auditlog.mjs  recent 20

# Server-side & AI SDK (work with NO account via TestData)
npm run ld:server                              # real evaluations, TestData source
npm run ld:ai "How do I upgrade?"              # AI Config resolve + metric tracking

# CLI (needs ldcli installed + authenticated)
./scripts/cli/setup-demo.sh default
./scripts/cli/toggle.sh beta-checkout on
```

### Docs (`docs/`)

Start at [`docs/README.md`](./docs/README.md). Covers the React SDK, server/AI
SDK, REST API, CLI, targeting, release management, experimentation, AI Configs,
segments, governance, integrations, observability, and advanced SDK topics — with
a master [coverage checklist](./docs/coverage.md).

---

## How the flags map to the app

The app references six flags (defined in [`src/lib/config.js`](./src/lib/config.js)
and provisioned by `seed.mjs`):

| Flag | Type | Drives |
|------|------|--------|
| `release-banner` | boolean | the release banner |
| `theme-color` | string | primary color / experiment arm |
| `items-per-page` | number | pagination size |
| `checkout-config` | JSON | structured checkout config |
| `beta-checkout` | boolean | the gated beta checkout flow |
| `ai-model-config` | JSON | model + params for the AI demo |

---

## Verified

- `npm run build` compiles clean (CI/lint-as-errors).
- The production build serves and loads the LD SDK bundle (HTTP 200).
- `scripts/server/evaluate.mjs` performs real evaluations against TestData
  (`beta-checkout` → `RULE_MATCH` for enterprise users).
- Every `scripts/api/*.mjs` runs safely in dry-run and emits correct requests
  (including the semantic-patch `Content-Type`).

## Notes & caveats

- The runnable app uses the **stable v3** React SDK; the **v4**
  (`@launchdarkly/react-sdk`) API — `createLDReactProvider`, typed hooks, React
  Server Components — is documented alongside each feature.
- Platform features that are dashboard/infra-only (SCIM, Data Export, Relay
  Proxy, Big Segment stores, guarded-rollout analysis) are documented and
  API-stubbed, not simulated end-to-end — those require account-level setup.
