# Release management & progressive delivery

Live demo: [`/demo/release`](../src/features/ReleaseDemo.js). Docs:
<https://launchdarkly.com/docs/home/release>

## Patterns

- **Ring / percentage rollout** — serve a new feature to 1% → 25% → 100% by
  editing the flag's rollout, no redeploy. (`flags.mjs rollout <flag> <pct>`)
- **Targeted release** — enable for a cohort first (`betaOptIn = true`,
  `plan = enterprise`, an allowlisted segment) before widening.
- **Kill switch** — toggle the flag off to revert everyone instantly.
  (`flags.mjs toggle <flag> off`)
- **Guarded release** — attach a metric so LaunchDarkly automatically monitors
  for regressions during a rollout and can **auto-roll-back** on a bad signal.
- **Scheduled changes** — queue a flag change for a future time / maintenance
  window (see [governance.md](./governance.md)).
- **Release pipelines** — standardize how changes flow environment→environment.

## Why the app code never changes during a rollout

```js
const { betaCheckout } = useFlags();
return betaCheckout ? <ExpressCheckout /> : <ClassicCheckout />;
```

The value streams in through `useFlags()`; changing the rollout percentage or
targeting in LaunchDarkly re-renders the component with the new value. Ship once,
release continuously.

## Guarded rollout wiring

1. Track a health metric (latency, error rate, conversion) with `track()`.
2. Create the metric (`metrics.mjs create …`).
3. Start a guarded rollout on the flag and attach the metric.
4. LaunchDarkly watches the metric during the rollout and rolls back if it
   regresses beyond your threshold.
