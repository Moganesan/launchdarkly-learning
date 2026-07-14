#!/usr/bin/env node
// Server-side SDK example (@launchdarkly/node-server-sdk).
//
// Demonstrates the server SDK lifecycle and the features that differ from the
// browser SDK: typed variation helpers, allFlagsState (for bootstrapping the
// browser), secureModeHash, and graceful shutdown.
//
//   LD_SDK_KEY=sdk-xxxx node scripts/server/evaluate.mjs
//
// With no LD_SDK_KEY it runs against the SDK's built-in TestData source so you
// can see real evaluations with zero network/account.
import 'dotenv/config';
import * as ld from '@launchdarkly/node-server-sdk';

const SDK_KEY = process.env.LD_SDK_KEY || '';
const context = {
  kind: 'user',
  key: 'user-abc-123',
  name: 'Ada Lovelace',
  plan: 'enterprise',
  country: 'GB',
};

async function main() {
  let client;

  if (!SDK_KEY) {
    // TestData: a programmable, in-memory flag source. Great for tests + demos.
    // Docs: SDK → Features → Test data sources.
    const td = new ld.integrations.TestData();
    td.update(td.flag('release-banner').booleanFlag().on(true));
    td.update(td.flag('items-per-page').valueForAll(25));
    td.update(
      td.flag('beta-checkout')
        .variations(true, false)
        // Default to `false` (index 1) unless a rule matches.
        .fallthroughVariation(1)
        // Serve `true` (index 0) only when the user's plan === 'enterprise'.
        // Signature: ifMatch(contextKind, attribute, ...values)
        .ifMatch('user', 'plan', 'enterprise').thenReturn(0),
    );
    // Pass the TestData *factory* as the update processor.
    client = ld.init('test-key', { updateProcessor: td.getFactory(), sendEvents: false });
    console.log('Using TestData source (no LD_SDK_KEY set).');
  } else {
    client = ld.init(SDK_KEY);
    console.log('Connecting to LaunchDarkly…');
  }

  await client.waitForInitialization({ timeout: 5 });
  console.log('Client ready.\n');

  // Typed variation methods — server SDKs pass the context explicitly.
  const banner = await client.boolVariation('release-banner', context, false);
  const perPage = await client.numberVariation('items-per-page', context, 10);
  const beta = await client.boolVariation('beta-checkout', context, false);

  console.log('boolVariation   release-banner  =', banner);
  console.log('numberVariation items-per-page  =', perPage);
  console.log('boolVariation   beta-checkout   =', beta);

  // variationDetail includes the reason.
  const detail = await client.boolVariationDetail('beta-checkout', context, false);
  console.log('\nboolVariationDetail beta-checkout =', JSON.stringify(detail));

  // allFlagsState → a payload you can hand to the browser SDK's bootstrap.
  // In production add { clientSideOnly: true } to include only flags exposed to
  // client-side SDKs. (TestData flags omit that metadata, so we skip the filter
  // here to keep the demo output non-empty.)
  const state = await client.allFlagsState(context);
  console.log('\nallFlagsState (for browser bootstrap):');
  console.log(JSON.stringify(state.toJSON(), null, 2));

  // Secure mode hash for the browser SDK (prevents context spoofing).
  if (SDK_KEY) {
    console.log('\nsecureModeHash =', client.secureModeHash(context));
  }

  // Custom event (feeds experiment metrics).
  client.track('checkout-completed', context, { plan: 'enterprise' }, 49.99);

  // Flush + close gracefully.
  await client.flush();
  await client.close();
  console.log('\nClient closed cleanly.');
}

main().catch((e) => { console.error(e); process.exit(1); });
