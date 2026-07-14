// Product demo: AI Configs.
//
// AI Configs let you manage LLM model + prompt configuration as a flag-like,
// targetable resource, and track AI metrics (tokens, latency, satisfaction).
// The React app reads the model config via a JSON flag; the actual AI SDK
// (server-side) is shown in scripts/ai. Docs: home → AI Configs.
import React, { useState } from 'react';
import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';
import { Page, Panel, Code, Value, Button, Badge } from '../components/ui';
import { IS_OFFLINE } from '../lib/config';

export default function AIConfigDemo() {
  const { aiModelConfig } = useFlags();
  const ldClient = useLDClient();
  const [log, setLog] = useState([]);

  function simulateGeneration() {
    // In production the AI SDK tracks these for you. Here we emit the same
    // custom metric events the AI SDK would send.
    const promptTokens = 120 + Math.floor(Math.random() * 40);
    const completionTokens = 200 + Math.floor(Math.random() * 80);
    if (ldClient && !IS_OFFLINE) {
      ldClient.track('$ld:ai:tokens:total', null, promptTokens + completionTokens);
      ldClient.track('$ld:ai:generation', { model: aiModelConfig?.model });
    }
    setLog((l) => [
      { promptTokens, completionTokens, model: aiModelConfig?.model, at: new Date().toLocaleTimeString() },
      ...l,
    ].slice(0, 10));
  }

  return (
    <Page
      title="AI Configs demo"
      subtitle="Manage model + prompt config as a targetable resource and track AI metrics."
      docPath="home/ai-configs"
    >
      <Panel title="Active model configuration">
        <Value label="ai-model-config (JSON flag)" value={aiModelConfig} />
        <p className="hint">
          Change the model, temperature, or token budget in LaunchDarkly and
          every request picks it up — no redeploy, and you can target configs by
          plan, region, or cohort just like any flag.
        </p>
      </Panel>

      <Panel title="Simulate a generation + metrics">
        <Button onClick={simulateGeneration}>Run generation (emit AI metrics)</Button>
        {IS_OFFLINE && <p className="hint">Offline: metrics counted locally.</p>}
        {log.length > 0 && (
          <ul className="event-log">
            {log.map((e, i) => (
              <li key={i}>
                <code>{e.at}</code> <Badge tone="ok">{e.model}</Badge>{' '}
                prompt={e.promptTokens} tok · completion={e.completionTokens} tok
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Server-side AI SDK (the real integration)">
        <p>
          The AI SDK resolves the config and wraps your model call to track
          tokens, latency, and feedback automatically:
        </p>
        <Code>{`import { init } from '@launchdarkly/node-server-sdk';
import { initAi } from '@launchdarkly/server-sdk-ai';

const ldClient = init(process.env.LD_SDK_KEY);
const aiClient = initAi(ldClient);

// Resolve the targeted AI Config for this context:
const cfg = await aiClient.config('support-assistant', context, {
  model: 'claude-opus-4-8',   // default
}, { userQuestion });

// cfg.messages is the rendered prompt; cfg.model has provider params.
const tracker = cfg.tracker;
const completion = await tracker.trackMetricsOf(() =>
  anthropic.messages.create({ model: cfg.model.name, messages: cfg.messages })
);
// tracker auto-records tokens, duration, and success to LaunchDarkly.`}</Code>
        <p className="hint">See <code>scripts/ai/generate.mjs</code> for a runnable version.</p>
      </Panel>
    </Page>
  );
}
