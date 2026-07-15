// SDK → Features → Flag variation evaluation.
//
// Shows the two ways to read flags in the v4 React SDK:
//   1. useFlags()  — a live object of all flags for the current context
//   2. ldClient.boolVariation(key, default) etc. — imperative, TYPED methods
// and covers all four value types: boolean, string, number, JSON.
import React from 'react';
import { useFlags, useLDClient } from '@launchdarkly/react-sdk';
import { Page, Panel, Value, Code } from '../components/ui';

export default function Variations() {
  // useFlags returns camelCased keys by default (release-banner → releaseBanner).
  const flags = useFlags();
  const ldClient = useLDClient();

  // Imperative TYPED methods. v4 dropped the generic variation() in favor of
  // boolVariation / stringVariation / numberVariation / jsonVariation. These
  // take the *stored* (kebab-case) flag key and a default. No context arg —
  // the client already holds the identified context.
  const imperativeBool = ldClient?.boolVariation('release-banner', false);

  return (
    <Page
      title="Flag variations"
      subtitle="Evaluate every flag type with useFlags() and the imperative typed variation methods."
      docPath="sdk/features/evaluating"
    >
      <Panel title="useFlags() — all types, live">
        <Value label="release-banner (boolean)" value={flags.releaseBanner} />
        <Value label="theme-color (string)" value={flags.themeColor} />
        <Value label="items-per-page (number)" value={flags.itemsPerPage} />
        <Value label="checkout-config (JSON)" value={flags.checkoutConfig} />
        <Value label="beta-checkout (boolean)" value={flags.betaCheckout} />
        <Code>{`import { useFlags } from '@launchdarkly/react-sdk';

function Component() {
  const { releaseBanner, themeColor, itemsPerPage } = useFlags();
  return releaseBanner ? <Banner color={themeColor} /> : null;
}`}</Code>
      </Panel>

      <Panel title="Imperative typed variation methods (v4)">
        <p>
          v4 exposes <em>typed</em> methods on the client — the generic{' '}
          <code>variation()</code> is gone. Each takes the stored flag key and a
          default; there is no context argument (the client holds the context):
        </p>
        <Value label="ldClient.boolVariation('release-banner', false)" value={imperativeBool} />
        <Code>{`const ldClient = useLDClient();

ldClient.boolVariation('release-banner', false);
ldClient.stringVariation('theme-color', '#000');
ldClient.numberVariation('items-per-page', 10);
ldClient.jsonVariation('checkout-config', {});

// For value + reason, use the *VariationDetail variants:
ldClient.boolVariationDetail('release-banner', false);
// => { value, variationIndex, reason }`}</Code>
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
