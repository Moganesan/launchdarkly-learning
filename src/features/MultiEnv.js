// SDK → Features → Multiple environments.
//
// The React SDK can host multiple LaunchDarkly clients at once — e.g. one per
// LaunchDarkly project/environment. In v3 you pass an `options` map keyed by an
// alias; useFlags(alias) / useLDClient(alias) read from that client. This is
// how you evaluate the SAME flag across prod + staging side by side.
import React from 'react';
import { Page, Panel, Code } from '../components/ui';

export default function MultiEnv() {
  return (
    <Page
      title="Multiple environments"
      subtitle="Run several LaunchDarkly clients in one app and compare them."
      docPath="sdk/features/multiple-environments"
    >
      <Panel title="v3 React SDK — the `options` alias map">
        <Code>{`const LDProvider = await asyncWithLDProvider({
  clientSideID: 'PRIMARY_CLIENT_ID',
  context,
  // Secondary environments keyed by alias:
  options: { /* primary options */ },
  // (v3) additional clients via the multi-environment config:
});

// Read from a specific client by alias:
const prodFlags    = useFlags();          // primary
const stagingFlags = useFlags('staging'); // secondary alias
const stagingClient = useLDClient('staging');`}</Code>
      </Panel>

      <Panel title="v4 React SDK — explicit client instances" tone="ok">
        <Code>{`import {
  initLDReactContext, createClient,
  createLDReactProviderWithClient, useBoolVariation,
} from '@launchdarkly/react-sdk';

const ProdCtx    = initLDReactContext();
const StagingCtx = initLDReactContext();

const prodClient    = createClient('prod-id',    { kind: 'user', key: 'u' });
const stagingClient = createClient('staging-id', { kind: 'user', key: 'u' });
prodClient.start(); stagingClient.start();

function Component() {
  const inProd    = useBoolVariation('my-feature', false, ProdCtx);
  const inStaging = useBoolVariation('my-feature', false, StagingCtx);
  return <Diff a={inProd} b={inStaging} />;
}`}</Code>
      </Panel>

      <Panel title="When you'd use this">
        <ul className="feature-list">
          <li>Compare a flag's value across environments (prod vs staging) in a debug console.</li>
          <li>Separate LaunchDarkly projects for distinct product lines in one app shell.</li>
          <li>A/B a migration by reading old + new project flags simultaneously.</li>
        </ul>
        <p className="hint">
          Each client maintains its own streaming connection, context, and event
          queue. Give each its own client-side ID.
        </p>
      </Panel>
    </Page>
  );
}
