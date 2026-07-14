#!/usr/bin/env node
// AI Configs + AI SDK example (@launchdarkly/server-sdk-ai over node-server-sdk).
//
// Shows how AI Configs turn model + prompt selection into a targetable,
// trackable resource, and how the AI SDK auto-records token/latency metrics.
//
//   LD_SDK_KEY=sdk-xxxx node scripts/ai/generate.mjs
//
// This script is illustrative: it does NOT call a real LLM (no API key needed).
// It resolves the AI Config and simulates a generation so the metric-tracking
// flow is visible. Swap the fake call for a real Anthropic call in production.
import 'dotenv/config';

const SDK_KEY = process.env.LD_SDK_KEY || '';

const context = { kind: 'user', key: 'user-abc-123', plan: 'enterprise' };

// Fallback config used if AI Configs aren't set up / no key present.
const FALLBACK = {
  model: { name: 'claude-opus-4-8', parameters: { temperature: 0.7, maxTokens: 1024 } },
  messages: [
    { role: 'system', content: 'You are a helpful support assistant for Acme Corp.' },
  ],
  enabled: true,
};

async function resolveConfig() {
  if (!SDK_KEY) {
    console.log('No LD_SDK_KEY — using fallback AI Config.\n');
    return { config: FALLBACK, tracker: fakeTracker() };
  }
  // Real integration:
  //   import { init } from '@launchdarkly/node-server-sdk';
  //   import { initAi } from '@launchdarkly/server-sdk-ai';
  //   const ld = init(SDK_KEY); await ld.waitForInitialization({ timeout: 5 });
  //   const aiClient = initAi(ld);
  //   return aiClient.config('support-assistant', context, FALLBACK, { userQuestion });
  console.log('LD_SDK_KEY set — resolve `support-assistant` AI Config here.\n');
  return { config: FALLBACK, tracker: fakeTracker() };
}

// Stand-in for the AI SDK's tracker, which wraps your model call and records
// duration, token counts, and success to LaunchDarkly automatically.
function fakeTracker() {
  return {
    async trackMetricsOf(fn) {
      const start = Date.now();
      const result = await fn();
      const ms = Date.now() - start;
      console.log(`[tracker] duration=${ms}ms tokens=${result.usage.totalTokens} success=true`);
      // Real tracker also records: $ld:ai:tokens:total, :input, :output,
      // :duration, :generation:success, and optional :feedback:positive/negative.
      return result;
    },
    trackFeedback(kind) { console.log(`[tracker] feedback=${kind}`); },
  };
}

async function main() {
  const { config, tracker } = await resolveConfig();
  console.log('Resolved AI Config:');
  console.log('  model  =', config.model.name);
  console.log('  params =', JSON.stringify(config.model.parameters));
  console.log('  prompt =', config.messages.map((m) => `${m.role}: ${m.content}`).join(' | '));

  const userQuestion = process.argv.slice(2).join(' ') || 'How do I reset my password?';
  console.log('\nUser:', userQuestion);

  // Wrap the model call so metrics are captured. Replace the body with a real
  // Anthropic Messages API call using config.model.name + config.messages.
  const completion = await tracker.trackMetricsOf(async () => {
    await new Promise((r) => setTimeout(r, 120)); // simulate latency
    return {
      text: `[${config.model.name}] Thanks for reaching out! Regarding "${userQuestion}" — `
        + `here a real model call would generate an answer using the prompt above.`,
      usage: { inputTokens: 132, outputTokens: 214, totalTokens: 346 },
    };
  });

  console.log('\nAssistant:', completion.text);
  tracker.trackFeedback('positive'); // e.g. from a 👍 in the UI
}

main().catch((e) => { console.error(e); process.exit(1); });
