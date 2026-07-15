// Product demo: Experimentation (A/B/n testing).
//
// A flag with multiple variations splits traffic; you track a metric event per
// conversion; LaunchDarkly attributes conversions to variations and computes
// statistical significance. This page simulates the client side of that loop.
// Docs: home → Experimentation.
import React, { useState } from 'react';
import { useFlags, useLDClient } from '@launchdarkly/react-sdk';
import { Page, Panel, Badge, Code, Button, Value } from '../components/ui';
import { IS_OFFLINE } from '../lib/config';

export default function ExperimentDemo() {
  const { themeColor } = useFlags();
  const ldClient = useLDClient();
  const [conversions, setConversions] = useState(0);
  const [views, setViews] = useState(0);

  // In a real experiment the *variation you receive* is your assigned arm.
  // We use theme-color as the experiment flag: each color = one variation.
  const variation = themeColor;

  function view() {
    setViews((v) => v + 1);
    if (ldClient && !IS_OFFLINE) ldClient.track('experiment-page-view');
  }

  function convert() {
    setConversions((c) => c + 1);
    // The conversion metric event. LaunchDarkly ties it to your assigned arm.
    if (ldClient && !IS_OFFLINE) ldClient.track('experiment-conversion', null, 1);
  }

  return (
    <Page
      title="Experimentation demo"
      subtitle="A/B test a variation, track a conversion metric, and feed LaunchDarkly's stats engine."
      docPath="home/experimentation"
    >
      <Panel title="Your assigned variation">
        <div className="experiment-arm" style={{ borderColor: variation }}>
          <Badge tone="ok">ARM</Badge>
          <span>You were bucketed into the <code>{variation}</code> variation.</span>
          <div className="theme-swatch" style={{ background: variation }} />
        </div>
        <p className="hint">
          Assignment is deterministic per context key — change the context (top
          bar) to potentially land in a different arm.
        </p>
      </Panel>

      <Panel title="Generate metric events">
        <div className="btn-row">
          <Button onClick={view}>Simulate page view → track('experiment-page-view')</Button>
          <Button onClick={convert}>Simulate conversion → track('experiment-conversion', 1)</Button>
        </div>
        <Value label="Views this session" value={views} />
        <Value label="Conversions this session" value={conversions} />
        {IS_OFFLINE && <p className="hint">Offline: metric events are counted locally only.</p>}
      </Panel>

      <Panel title="How an experiment is wired end to end">
        <ol className="feature-list">
          <li>Create a <strong>metric</strong> (e.g. <code>experiment-conversion</code>) — done via API/UI (see REST API page).</li>
          <li>Create an <strong>experiment</strong> on a multi-variation flag and attach the metric.</li>
          <li>The SDK <strong>serves a variation</strong> and records an exposure automatically on evaluation.</li>
          <li>Your app <strong>calls track()</strong> when the user converts.</li>
          <li>LaunchDarkly computes <strong>per-arm conversion + significance</strong> and picks a winner.</li>
        </ol>
        <Code>{`// exposure is automatic when the experiment flag is evaluated:
const arm = useFlags().themeColor;          // records exposure
// conversion is explicit:
ldClient.track('experiment-conversion', null, 1);`}</Code>
      </Panel>
    </Page>
  );
}
