# Experimentation

Live demo: [`/demo/experiment`](../src/features/ExperimentDemo.js). Docs:
<https://launchdarkly.com/docs/home/experimentation>

## The loop

1. **Metric** — define what "better" means (a conversion event or a numeric
   value). Created from the events your app sends via `track()`.
   `node scripts/api/metrics.mjs create experiment-conversion "Conversion"`
2. **Experiment** — run on a multi-variation flag; attach the metric; allocate
   traffic across treatments.
   `node scripts/api/experiments.mjs create theme-color experiment-conversion "Theme test"`
3. **Exposure** — recorded automatically when the experiment flag is evaluated
   (the SDK sends an evaluation event).
4. **Conversion** — your app calls `track('experiment-conversion', null, 1)`.
5. **Analysis** — LaunchDarkly computes per-arm results, credible intervals, and
   probability-to-be-best, and can declare a winner.

## Client code

```js
const arm = useFlags().themeColor;                // records exposure
// … user converts …
ldClient.track('experiment-conversion', null, 1); // records conversion
```

Assignment is deterministic per context key — the same user stays in the same
arm across sessions. Change the context to (potentially) land in a different arm.

## Concepts

- **Bayesian analysis** — probability a variation beats control, plus expected
  loss. No fixed sample size required to peek.
- **Metric kinds** — conversion (binary), numeric (uses the `metricValue` arg),
  and funnel metrics.
- **Randomization unit** — usually the user, but can be any context kind.
- **Holdouts** — carve out a global control group excluded from all experiments
  to measure aggregate impact over time.
- **Sample ratio mismatch** guards protect against skewed allocation.
