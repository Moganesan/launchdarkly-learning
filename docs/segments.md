# Segments

Reusable groups of contexts you can target from any flag. Runnable:
[`scripts/api/segments.mjs`](../scripts/api/segments.mjs). Docs:
<https://launchdarkly.com/docs/home/flags/segments>

## Standard segments

Membership = an include/exclude list of individuals **plus** rules (clauses on
attributes). Reference from a flag with a `segmentMatch` clause.

```bash
node scripts/api/segments.mjs create beta-users "Beta users"
node scripts/api/segments.mjs add    beta-users user-abc-123   # include an individual
node scripts/api/segments.mjs rule   beta-users                # add attribute rule (country=GB)
```

## Big Segments

For very large membership lists (millions), backed by an external store
(Redis/DynamoDB) so the SDK doesn't hold the whole list in memory. Create with
`unbounded: true`:

```js
POST /segments/{project}/{env}  { "key": "all-paid", "unbounded": true }
```

Client/server SDKs need a **Big Segment store** configured to evaluate them.
Docs: <https://launchdarkly.com/docs/sdk/features/big-segments>

## Synced segments

Populate a segment from an external audience source (e.g. Amplitude cohorts) so
targeting stays in sync with your data platform.

## Using a segment in a flag rule

```json
{ "clauses": [ { "attribute": "segmentMatch", "op": "segmentMatch", "values": ["beta-users"] } ] }
```
