// SDK → Features → typed variation hooks (v4 @launchdarkly/react-sdk).
//
// v4 ships typed, single-flag hooks that re-render a component ONLY when that
// specific flag changes (better performance than useFlags, which re-renders on
// any flag change). Each has a *Detail variant returning value + reason.
import React from 'react';
import {
  useBoolVariation,
  useStringVariation,
  useNumberVariation,
  useJsonVariation,
  useBoolVariationDetail,
} from '@launchdarkly/react-sdk';
import { Page, Panel, Value, Code } from '../components/ui';

export default function TypedVariations() {
  // These are the REAL v4 hooks. They take the stored (kebab-case) flag key.
  const showBanner = useBoolVariation('release-banner', false);
  const theme = useStringVariation('theme-color', '#000');
  const perPage = useNumberVariation('items-per-page', 10);
  const config = useJsonVariation('checkout-config', {});

  // The *Detail variant also returns variationIndex + reason.
  const bannerDetail = useBoolVariationDetail('release-banner', false);

  return (
    <Page
      title="Typed variations"
      subtitle="Type-safe, single-flag hooks — the v4 React SDK API used for real on this page."
      docPath="sdk/client-side/react/react-web"
    >
      <Panel title="Values via typed hooks (live)">
        <Value label="useBoolVariation('release-banner', false)" value={showBanner} />
        <Value label="useStringVariation('theme-color', '#000')" value={theme} />
        <Value label="useNumberVariation('items-per-page', 10)" value={perPage} />
        <Value label="useJsonVariation('checkout-config', {})" value={config} />
      </Panel>

      <Panel title="Detail hook — value + variationIndex + reason">
        <Value label="value" value={bannerDetail.value} />
        <Value label="variationIndex" value={bannerDetail.variationIndex} />
        <Value label="reason" value={bannerDetail.reason} />
      </Panel>

      <Panel title="Why typed hooks" tone="ok">
        <Code>{`import {
  useBoolVariation, useStringVariation,
  useNumberVariation, useJsonVariation,
  useBoolVariationDetail,
} from '@launchdarkly/react-sdk';

const show   = useBoolVariation('release-banner', false);
const theme  = useStringVariation('theme-color', 'light');
const max    = useNumberVariation('items-per-page', 10);
const config = useJsonVariation('checkout-config', {});

const { value, variationIndex, reason } =
  useBoolVariationDetail('release-banner', false);`}</Code>
        <p className="hint">
          Each hook subscribes to <em>one</em> flag, so a change to an unrelated
          flag won't re-render this component. <code>useFlags()</code> still
          exists (and is used elsewhere in this app) but is marked for removal in
          a future major version — prefer these typed hooks in new code.
        </p>
      </Panel>
    </Page>
  );
}
