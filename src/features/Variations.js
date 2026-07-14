// SDK → Features → Flag variation evaluation.
//
// Shows the two ways to read flags in the React SDK:
//   1. useFlags()  — a live object of all flags for the current context
//   2. ldClient.variation(key, default) — imperative, matches other SDKs
// and covers all four value types: boolean, string, number, JSON.
import React from 'react';
import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';
import { Page, Panel, Value, Code } from '../components/ui';
import { DEMO_FLAG_KEYS, OFFLINE_BOOTSTRAP } from '../lib/config';

export default function Variations() {
  // useFlags returns camelCased keys by default (release-banner → releaseBanner).
  const flags = useFlags();
  const ldClient = useLDClient();

  // The imperative API. variation(key, default) mirrors server-side SDKs.
  // Note: with the React SDK the *hook* (useFlags) is the idiomatic path;
  // variation() is shown here for parity with the docs' method list.
  const imperativeBool =
    ldClient?.variation(DEMO_FLAG_KEYS.releaseBanner, false) ??
    OFFLINE_BOOTSTRAP.releaseBanner;

  return (
    <Page
      title="Flag variations"
      subtitle="Evaluate every flag type with useFlags() and the imperative variation() API."
      docPath="sdk/features/evaluating"
    >
      <Panel title="useFlags() — all types, live">
        <Value label="release-banner (boolean)" value={flags.releaseBanner} />
        <Value label="theme-color (string)" value={flags.themeColor} />
        <Value label="items-per-page (number)" value={flags.itemsPerPage} />
        <Value label="checkout-config (JSON)" value={flags.checkoutConfig} />
        <Value label="beta-checkout (boolean)" value={flags.betaCheckout} />
        <Code>{`import { useFlags } from 'launchdarkly-react-client-sdk';

function Component() {
  const { releaseBanner, themeColor, itemsPerPage } = useFlags();
  return releaseBanner ? <Banner color={themeColor} /> : null;
}`}</Code>
      </Panel>

      <Panel title="Imperative variation() API">
        <p>
          Every SDK exposes typed variation methods. In the browser SDK the
          generic <code>variation(key, default)</code> returns the current value:
        </p>
        <Value label="ldClient.variation('release-banner', false)" value={imperativeBool} />
        <Code>{`const ldClient = useLDClient();

// Generic — returns whatever type the flag serves:
const show = ldClient.variation('release-banner', false);

// Server-side SDKs additionally expose typed helpers:
//   boolVariation(key, ctx, default)
//   stringVariation(key, ctx, default)
//   intVariation / doubleVariation(key, ctx, default)
//   jsonVariation(key, ctx, default)`}</Code>
      </Panel>

      <Panel title="Live effect" tone="ok">
        <div
          className="theme-preview"
          style={{ borderColor: flags.themeColor, color: flags.themeColor }}
        >
          {flags.releaseBanner
            ? '🎉 release-banner is ON — this banner is flag-controlled.'
            : 'release-banner is OFF.'}
          <div className="theme-swatch" style={{ background: flags.themeColor }} />
          Rendering {flags.itemsPerPage} items per page.
        </div>
      </Panel>
    </Page>
  );
}
