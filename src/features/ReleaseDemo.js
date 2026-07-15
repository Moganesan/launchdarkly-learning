// Product demo: Release management (progressive delivery).
//
// Ties together flag-gated features, percentage rollouts, and a "kill switch".
// Demonstrates how a boolean flag + targeting rules drive a real UI without a
// redeploy. Docs: home → Release management / Progressive rollouts / Guarded
// releases.
import React from 'react';
import { useFlags } from '@launchdarkly/react-sdk';
import { Page, Panel, Badge, Code } from '../components/ui';

export default function ReleaseDemo() {
  const { betaCheckout, releaseBanner, themeColor } = useFlags();

  return (
    <Page
      title="Release management demo"
      subtitle="Progressive delivery: gate a beta behind a flag, roll it out by percentage, kill it instantly."
      docPath="home/release"
    >
      {releaseBanner && (
        <div className="release-banner" style={{ background: themeColor }}>
          🚀 We just shipped something new! (controlled by <code>release-banner</code>)
        </div>
      )}

      <Panel title="The checkout page (feature-gated)">
        <div className="checkout-demo">
          <h3>Checkout</h3>
          {betaCheckout ? (
            <div className="beta-checkout">
              <Badge tone="ok">BETA</Badge>
              <p>✨ One-click express checkout (new flow behind <code>beta-checkout</code>).</p>
              <button className="btn btn-primary" type="button">Buy now — 1 click</button>
            </div>
          ) : (
            <div className="classic-checkout">
              <Badge tone="neutral">STABLE</Badge>
              <p>Classic multi-step checkout.</p>
              <button className="btn btn-secondary" type="button">Continue to payment →</button>
            </div>
          )}
        </div>
        <p className="hint">
          Flip <code>beta-checkout</code> in your dashboard (or its targeting
          rule for <code>plan = enterprise</code>) to change this instantly.
        </p>
      </Panel>

      <Panel title="Progressive delivery patterns this maps to">
        <ul className="feature-list">
          <li><strong>Percentage rollout</strong> — serve the beta to 5% → 25% → 100% via the flag's rollout, no code change.</li>
          <li><strong>Targeted release</strong> — turn it on only for <code>betaOptIn = true</code> or <code>plan = enterprise</code>.</li>
          <li><strong>Kill switch</strong> — toggle the flag off to instantly revert everyone to the stable flow.</li>
          <li><strong>Guarded rollout</strong> — attach a metric so LaunchDarkly auto-rolls-back on regression.</li>
        </ul>
        <Code>{`// Nothing changes in this component when you roll out —
// the flag value flows in through useFlags() and re-renders live.
const { betaCheckout } = useFlags();
return betaCheckout ? <ExpressCheckout /> : <ClassicCheckout />;`}</Code>
      </Panel>
    </Page>
  );
}
