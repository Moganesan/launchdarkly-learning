import React from 'react';
import { Link } from 'react-router-dom';
import { Page, Panel, Badge } from '../components/ui';
import { IS_OFFLINE, LD_CLIENT_ID } from '../lib/config';

export default function Home() {
  return (
    <Page
      title="LaunchDarkly — complete feature demo"
      subtitle="A runnable tour of the React SDK, plus documented, runnable REST API & CLI automation for the wider platform."
      docPath="home"
    >
      <Panel title="How this app is organized">
        <p>
          Every page maps to a documented LaunchDarkly capability. The left nav
          is grouped the way the docs are: SDK evaluation, contexts & events,
          advanced SDK config, product-level demos, and platform automation.
        </p>
        <ul className="feature-list">
          <li><strong>React SDK pages</strong> — genuinely wired to the SDK. Flip the context switcher (top bar) and watch values change.</li>
          <li><strong>Product demos</strong> — realistic release, experiment, and AI-config flows built on flags.</li>
          <li><strong>Platform automation</strong> — the REST API & CLI pages document runnable scripts in <code>/scripts</code>.</li>
          <li><strong>Coverage map</strong> — a checklist of every feature area with where it lives.</li>
        </ul>
      </Panel>

      <Panel title="Current mode" tone={IS_OFFLINE ? 'warn' : 'ok'}>
        {IS_OFFLINE ? (
          <>
            <p>
              <Badge tone="warn">OFFLINE / MOCK</Badge> No client-side ID is set
              (or offline is forced). Flags resolve from a local bootstrap map so
              every page still renders. To go live:
            </p>
            <ol>
              <li>Copy <code>.env.example</code> → <code>.env</code></li>
              <li>Set <code>REACT_APP_LD_CLIENT_ID</code> to your environment's client-side ID</li>
              <li>Restart <code>npm start</code></li>
            </ol>
          </>
        ) : (
          <p>
            <Badge tone="ok">LIVE</Badge> Connected with client-side ID{' '}
            <code>{LD_CLIENT_ID.slice(0, 6)}…</code>. Streaming is on — toggle a
            flag in your dashboard and watch it update here in real time.
          </p>
        )}
      </Panel>

      <Panel title="Start here">
        <div className="card-grid">
          <Link className="start-card" to="/variations">
            <h3>Flag variations →</h3>
            <p>useFlags / boolVariation / variation for every flag type.</p>
          </Link>
          <Link className="start-card" to="/contexts">
            <h3>Contexts & identify →</h3>
            <p>Single, multi, and anonymous contexts; live re-evaluation.</p>
          </Link>
          <Link className="start-card" to="/demo/experiment">
            <h3>Experimentation →</h3>
            <p>Track a metric event and see how experiments consume it.</p>
          </Link>
          <Link className="start-card" to="/coverage">
            <h3>Coverage map →</h3>
            <p>The full checklist of covered LaunchDarkly features.</p>
          </Link>
        </div>
      </Panel>
    </Page>
  );
}
