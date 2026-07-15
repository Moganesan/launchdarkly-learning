// SDK → Features → Getting all flags.
//
// allFlags() / useFlags() returns the full flag set for the current context.
// Useful for debugging, server-side rendering handoff, and bootstrapping other
// SDKs. This page also demonstrates allFlagsState-style JSON you can pass to a
// browser SDK's bootstrap option.
import React from 'react';
import { useFlags, useLDClient } from '@launchdarkly/react-sdk';
import { Page, Panel, Code, Button } from '../components/ui';

export default function AllFlags() {
  const flags = useFlags();
  const ldClient = useLDClient();

  function copyBootstrap() {
    const json = JSON.stringify(ldClient?.allFlags?.() ?? flags, null, 2);
    navigator.clipboard?.writeText(json);
  }

  return (
    <Page
      title="All flags"
      subtitle="Read every flag for the current context at once."
      docPath="sdk/features/all-flags"
    >
      <Panel title="Current flag set (useFlags / allFlags)">
        <Code lang="json">{JSON.stringify(flags, null, 2)}</Code>
        <Button onClick={copyBootstrap}>Copy as bootstrap JSON</Button>
      </Panel>

      <Panel title="Where you'd use this">
        <Code>{`// Client-side: the whole map, for the CURRENT context.
const all = ldClient.allFlags();

// Server-side (Node): produce a bootstrap payload for the browser SDK so the
// first client render has no flash of default values:
const state = await ldClient.allFlagsState(context, { clientSideOnly: true });
res.send(renderPage({ bootstrap: state.toJSON() }));

// Then in the browser (v4):
createLDReactProvider(clientSideID, context, { bootstrap });`}</Code>
      </Panel>
    </Page>
  );
}
