# Coverage checklist

Mirrors the in-app [Coverage page](../src/features/Coverage.js). Status legend:
**LIVE** = runnable React page · **SCRIPT** = runnable Node/CLI script ·
**DOC** = documented platform/dashboard feature.

## React (client-side) SDK

- [x] LIVE — Flag evaluation (`useFlags` / `variation`) — `/variations`
- [x] LIVE — Typed variations (bool/string/number/json) — `/typed`
- [x] LIVE — Evaluation details & reasons — `/details`
- [x] LIVE — All flags / allFlags — `/all-flags`
- [x] LIVE — Contexts: single / multi / anonymous — `/contexts`
- [x] LIVE — identify() / changing contexts — `/contexts`
- [x] LIVE — Private attributes — `/contexts`
- [x] LIVE — Track events + metric values — `/track`
- [x] LIVE — Flush events — `/track`
- [x] LIVE — Streaming & subscribe to changes — `/streaming`
- [x] LIVE — Bootstrapping (object / localStorage / SSR) — `/bootstrap`
- [x] LIVE — Inspectors (flag-used / changed) — `/inspectors`
- [x] LIVE — Logging configuration — `ldProvider.js`
- [x] LIVE — Multiple environments — `/multi-env`
- [x] LIVE — SDK status / waitForInitialization — `/status`
- [x] LIVE — Offline mode — `/status`
- [x] DOC  — Secure mode (hash) — `/status`, `advanced-sdk.md`

## Server-side & AI SDK

- [x] SCRIPT — Node server SDK evaluation (typed variations) — `scripts/server`
- [x] SCRIPT — allFlagsState → browser bootstrap — `scripts/server`
- [x] SCRIPT — TestData source — `scripts/server`
- [x] SCRIPT — AI SDK config + trackMetricsOf — `scripts/ai`
- [x] DOC — Migrations, OpenFeature, edge SDKs — `advanced-sdk.md`

## Product demos

- [x] LIVE — Release management / progressive delivery — `/demo/release`
- [x] LIVE — Experimentation (A/B/n + metrics) — `/demo/experiment`
- [x] LIVE — AI Configs + AI metrics — `/demo/ai-config`

## REST API (scripts/api)

- [x] SCRIPT — Projects · Environments · Flags (CRUD + semantic-patch toggle/rollout)
- [x] SCRIPT — Segments (+ Big Segments) · Metrics · Experiments
- [x] SCRIPT — Approvals · Members/Teams/Tokens/Roles · Webhooks · Audit log
- [x] SCRIPT — `seed.mjs` provisions the whole demo

## CLI (scripts/cli)

- [x] SCRIPT — flags / environments / setup / dev-server / sourcemaps — `cli.md`

## Platform (documented)

- [x] DOC — Targeting: rules, individual targets, prerequisites — `targeting.md`
- [x] DOC — Percentage rollouts, guarded releases, scheduling — `release-management.md`
- [x] DOC — Holdouts, Bayesian analysis, funnel metrics — `experimentation.md`
- [x] DOC — Data Export, webhooks, code refs, Terraform, app integrations — `integrations.md`
- [x] DOC — Observability SDK, session replay, OpenTelemetry, Relay Proxy — `observability.md`
- [x] DOC — Big Segments, synced segments — `segments.md`
- [x] DOC — Approvals, workflows, RBAC/custom roles, SCIM/SSO, IP allowlisting — `governance.md`
- [x] DOC — AgentControl — `ai-configs.md`
