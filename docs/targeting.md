# Feature flag targeting

How LaunchDarkly decides which variation a context receives. Docs:
<https://launchdarkly.com/docs/home/flags/targeting>

Evaluation order (first match wins):

1. **Flag off?** → serve the *off variation*.
2. **Individual targets** — explicit context keys mapped to a variation.
3. **Rules** — clauses on attributes/segments, each serving a variation or rollout.
4. **Fallthrough** — the default when no rule matches (a variation or a rollout).

## Individual targets

Pin specific contexts to a variation regardless of rules. Via API:

```bash
node scripts/api/flags.mjs get beta-checkout   # inspect targets
# semantic patch instruction: addTargets / removeTargets
```

## Rules & clauses

A rule is a set of **clauses** (all must match) that serves one variation or a
percentage rollout. Clause shape:

```json
{ "contextKind": "user", "attribute": "country", "op": "in", "values": ["GB", "US"] }
```

Operators: `in`, `startsWith`, `endsWith`, `matches` (regex), `contains`,
`lessThan`, `greaterThan`, `before`/`after` (dates), `semVerEqual`/`GreaterThan`,
`segmentMatch`. Negate with `"negate": true`.

Add a rule via API (verified pattern in `segments.mjs rule`):

```json
{ "instructions": [ { "kind": "addRule",
  "clauses": [ { "contextKind": "user", "attribute": "plan", "op": "in", "values": ["enterprise"] } ],
  "variationId": "<id>" } ] }
```

Server-SDK TestData equivalent (see `scripts/server/evaluate.mjs`):

```js
td.flag('beta-checkout').variations(true, false)
  .fallthroughVariation(1)
  .ifMatch('user', 'plan', 'enterprise').thenReturn(0);
// → RULE_MATCH → true for enterprise users, FALLTHROUGH → false otherwise
```

## Percentage rollouts

Split the fallthrough (or a rule) across variations by weight. Deterministic per
context key, so a user stays in the same bucket.

```bash
node scripts/api/flags.mjs rollout beta-checkout 25   # 25% get variation 0
```

Weights are in 1/1000 of a percent (25% = 25000).

## Prerequisites

A flag can require another flag to be **on and serving a specific variation**
before it evaluates its own rules; otherwise it returns the off variation with
reason `PREREQUISITE_FAILED`. Great for gating a feature behind an entitlement
flag. Managed in the dashboard or via the `addPrerequisite` semantic instruction.

## Segments as targets

Reference a reusable segment in a clause with `op: segmentMatch`. See
[segments.md](./segments.md).
