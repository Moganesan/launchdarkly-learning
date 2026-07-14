# AI Configs & AgentControl

Live demo: [`/demo/ai-config`](../src/features/AIConfigDemo.js). Runnable:
[`scripts/ai/generate.mjs`](../scripts/ai/generate.mjs). Docs:
<https://launchdarkly.com/docs/home/ai-configs>

## What an AI Config is

A flag-like, **targetable** resource that holds:

- the **model** and its parameters (temperature, max tokens, provider),
- one or more **prompt/message templates** (with variable interpolation),
- and is **versioned** so you can A/B prompts and roll back safely.

You change models or prompts in LaunchDarkly — no redeploy — and target configs
by plan, region, or cohort exactly like feature flags.

## AI SDK

Packages: `@launchdarkly/server-sdk-ai` (Node/Go/Python/Ruby/.NET) over a
server SDK.

```js
import { init } from '@launchdarkly/node-server-sdk';
import { initAi } from '@launchdarkly/server-sdk-ai';

const aiClient = initAi(init(process.env.LD_SDK_KEY));

// Resolve the targeted config for this context, with a fallback + variables.
const cfg = await aiClient.config('support-assistant', context,
  { model: { name: 'claude-opus-4-8' } },
  { userQuestion });

// cfg.model.name / cfg.model.parameters / cfg.messages (rendered prompt)
const result = await cfg.tracker.trackMetricsOf(() =>
  anthropic.messages.create({ model: cfg.model.name, messages: cfg.messages })
);
cfg.tracker.trackFeedback('positive'); // 👍 from the UI
```

## AI metrics (tracked automatically by the SDK)

`$ld:ai:tokens:total` · `:input` · `:output` · `:duration` ·
`:generation:success` · `:feedback:positive` / `:negative`. These power
dashboards and let you **experiment on prompts/models** with the same
experimentation engine as flags.

## AgentControl

Extends AI Configs to **agentic** systems: manage tool selection, agent
instructions, and multi-step behavior as targetable, observable configs. Docs:
<https://launchdarkly.com/docs/home/agent-control>
