// SDK → Features → Multiple environments.
//
// The React SDK can host multiple LaunchDarkly clients at once — e.g. one per
// LaunchDarkly project/environment. v4 uses explicit client instances plus a
// per-client React context, so you evaluate the SAME flag across prod + staging
// side by side. (The whole app runs on v4; this page documents the pattern.)
import React from 'react';
import { Page, Panel, Code, Badge } from '../components/ui';

export default function MultiEnv() {
  return (
    <Page
      title="Multiple environments"
      subtitle="Run several LaunchDarkly clients in one app and compare them (v4 API)."
      docPath="sdk/features/multiple-environments"
    >
      <Panel title="v4 React SDK — explicit client instances" tone="ok">
        <p>
          <Badge tone="ok">CURRENT</Badge> Create a React context and a client
          per environment, then pass the context into any typed hook:
        </p>
        <Code>{`import {
  initLDReactContext, createClient,
  createLDReactProviderWithClient, useBoolVariation,
} from '@launchdarkly/react-sdk';

const ProdCtx    = initLDReactContext();
const StagingCtx = initLDReactContext();

const prodClient    = createClient('prod-id',    { kind: 'user', key: 'u' });
const stagingClient = createClient('staging-id', { kind: 'user', key: 'u' });
prodClient.start(); stagingClient.start();

// Wrap the tree with a provider per client context:
//   <ProdProvider><StagingProvider>…</StagingProvider></ProdProvider>
// (each built with createLDReactProviderWithClient(client, Ctx))

function Component() {
  const inProd    = useBoolVariation('my-feature', false, ProdCtx);
  const inStaging = useBoolVariation('my-feature', false, StagingCtx);
  return <Diff a={inProd} b={inStaging} />;
}`}</Code>
      </Panel>

      <Panel title="v3 React SDK — the `options` alias map (legacy)">
        <p>For reference, the deprecated v3 package used an alias map instead:</p>
        <Code>{`// v3 (launchdarkly-react-client-sdk) — DEPRECATED
const LDProvider = await asyncWithLDProvider({
  clientSideID: 'PRIMARY_CLIENT_ID',
  context,
  options: { /* primary options + secondary env aliases */ },
});
const stagingFlags  = useFlags('staging');   // read by alias
const stagingClient = useLDClient('staging');`}</Code>
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
