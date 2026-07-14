# REST API

Base: `https://app.launchdarkly.com/api/v2` (EU: `app.eu.launchdarkly.com`,
Federal: `app.launchdarkly.us`). Docs: <https://launchdarkly.com/docs/api>

Runnable wrappers live in [`scripts/api/`](../scripts/api/) and share
[`_client.mjs`](../scripts/api/_client.mjs). **No token → dry-run** (prints the
request it would send).

## Auth & versioning

```
Authorization: <your-api-access-token>
LD-API-Version: 20240415
```

## Three PATCH formats

| Format | Content-Type | When |
|--------|--------------|------|
| JSON Patch (RFC 6902) | `application/json` | precise field ops: `[{op,path,value}]` |
| JSON Merge Patch (RFC 7386) | `application/merge-patch+json` | shallow merge of a partial object |
| **Semantic Patch** | `application/json; domain-model=launchdarkly.semanticpatch` | intent-based instructions, all-or-nothing |

Example semantic patch to toggle a flag (verified by `flags.mjs toggle`):

```json
PATCH /api/v2/flags/{project}/{flag}
Content-Type: application/json; domain-model=launchdarkly.semanticpatch

{ "environmentKey": "production", "instructions": [ { "kind": "turnFlagOn" } ] }
```

## Resource groups → scripts

| Resource | Endpoints | Script |
|----------|-----------|--------|
| Projects | `GET/POST /projects`, `…/{key}` | `projects.mjs` |
| Environments | `…/projects/{p}/environments` | `environments.mjs` |
| Feature flags | `GET/POST /flags/{p}`, `PATCH …/{key}` | `flags.mjs` |
| Segments | `…/segments/{p}/{env}` | `segments.mjs` |
| Metrics | `…/metrics/{p}` | `metrics.mjs` |
| Experiments | `…/projects/{p}/environments/{e}/experiments` | `experiments.mjs` |
| Approvals | `/approval-requests`, `…/reviews` | `approvals.mjs` |
| Members / Teams / Tokens / Roles | `/members`, `/teams`, `/tokens`, `/roles` | `members.mjs` |
| Webhooks | `/webhooks` | `webhooks.mjs` |
| Audit log | `/auditlog` | `auditlog.mjs` |

## Examples

```bash
node scripts/api/projects.mjs     list
node scripts/api/flags.mjs        create beta-checkout "Beta checkout" bool
node scripts/api/flags.mjs        toggle beta-checkout on
node scripts/api/flags.mjs        rollout beta-checkout 25          # 25% rollout
node scripts/api/segments.mjs     create beta-users "Beta users"
node scripts/api/segments.mjs     rule   beta-users                 # add a targeting rule
node scripts/api/metrics.mjs      create checkout-completed "Checkout" numeric
node scripts/api/experiments.mjs  create beta-checkout checkout-completed "Beta test"
node scripts/api/approvals.mjs    request beta-checkout on
node scripts/api/auditlog.mjs     recent 20
node scripts/api/seed.mjs                                           # provision everything
```

## Official API client

For typed access, LaunchDarkly publishes `launchdarkly-api-typescript` (installed
here as a dev dependency). The plain-`fetch` wrappers are used in this repo so the
requests are fully transparent and dependency-light.
