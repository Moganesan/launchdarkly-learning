// The next-generation React SDK (@launchdarkly/react-sdk v4) ships typed,
// single-flag hooks that re-render a component only when THAT flag changes.
// This demo app runs on the stable v3 SDK, so here we (a) document the v4 API
// and (b) provide equivalent lightweight typed wrappers over v3's useFlags so
// you can use the same ergonomics today.
import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Page, Panel, Value, Code } from '../components/ui';

// --- Typed wrappers over v3 (drop-in ergonomics) ---------------------------
function useBoolVariation(key, def) {
  const v = useFlags()[key];
  return typeof v === 'boolean' ? v : def;
}
function useStringVariation(key, def) {
  const v = useFlags()[key];
  return typeof v === 'string' ? v : def;
}
function useNumberVariation(key, def) {
  const v = useFlags()[key];
  return typeof v === 'number' ? v : def;
}
function useJsonVariation(key, def) {
  const v = useFlags()[key];
  return v && typeof v === 'object' ? v : def;
}

export default function TypedVariations() {
  const showBanner = useBoolVariation('releaseBanner', false);
  const theme = useStringVariation('themeColor', '#000');
  const perPage = useNumberVariation('itemsPerPage', 10);
  const config = useJsonVariation('checkoutConfig', {});

  return (
    <Page
      title="Typed variations"
      subtitle="Type-safe, single-flag hooks — the v4 React SDK API, with v3-compatible wrappers."
      docPath="sdk/client-side/react/react-web"
    >
      <Panel title="Values via typed hooks">
        <Value label="useBoolVariation('release-banner', false)" value={showBanner} />
        <Value label="useStringVariation('theme-color', '#000')" value={theme} />
        <Value label="useNumberVariation('items-per-page', 10)" value={perPage} />
        <Value label="useJsonVariation('checkout-config', {})" value={config} />
      </Panel>

      <Panel title="v4 React SDK (@launchdarkly/react-sdk)" tone="ok">
        <p>
          The v4 package provides these hooks natively, plus{' '}
          <code>*Detail</code> variants that also return{' '}
          <code>variationIndex</code> and <code>reason</code>:
        </p>
        <Code>{`import {
  useBoolVariation, useStringVariation,
  useNumberVariation, useJsonVariation,
  useBoolVariationDetail,
} from '@launchdarkly/react-sdk';

const show   = useBoolVariation('show-new-feature', false);
const theme  = useStringVariation('ui-theme', 'light');
const max    = useNumberVariation('max-items', 10);
const config = useJsonVariation('my-config', {});

const { value, variationIndex, reason } =
  useBoolVariationDetail('example-flag', false);`}</Code>
        <p className="hint">
          v4 sets up the provider with{' '}
          <code>createLDReactProvider(clientSideID, context, options)</code> and
          adds React Server Component support via{' '}
          <code>@launchdarkly/react-sdk/server</code>.
        </p>
      </Panel>
    </Page>
  );
}
