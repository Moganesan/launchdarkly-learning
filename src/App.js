import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useInitializationStatus } from '@launchdarkly/react-sdk';
import { LDProvider } from './lib/ldProvider';
import { IS_OFFLINE } from './lib/config';
import Layout from './components/Layout';

import Home from './features/Home';
import Variations from './features/Variations';
import EvaluationDetails from './features/EvaluationDetails';
import AllFlags from './features/AllFlags';
import TypedVariations from './features/TypedVariations';
import Contexts from './features/Contexts';
import Track from './features/Track';
import Streaming from './features/Streaming';
import Bootstrap from './features/Bootstrap';
import Inspectors from './features/Inspectors';
import MultiEnv from './features/MultiEnv';
import Status from './features/Status';
import ReleaseDemo from './features/ReleaseDemo';
import ExperimentDemo from './features/ExperimentDemo';
import AIConfigDemo from './features/AIConfigDemo';
import RestApi from './features/RestApi';
import Cli from './features/Cli';
import Coverage from './features/Coverage';

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/variations" element={<Variations />} />
        <Route path="/details" element={<EvaluationDetails />} />
        <Route path="/all-flags" element={<AllFlags />} />
        <Route path="/typed" element={<TypedVariations />} />
        <Route path="/contexts" element={<Contexts />} />
        <Route path="/track" element={<Track />} />
        <Route path="/streaming" element={<Streaming />} />
        <Route path="/bootstrap" element={<Bootstrap />} />
        <Route path="/inspectors" element={<Inspectors />} />
        <Route path="/multi-env" element={<MultiEnv />} />
        <Route path="/status" element={<Status />} />
        <Route path="/demo/release" element={<ReleaseDemo />} />
        <Route path="/demo/experiment" element={<ExperimentDemo />} />
        <Route path="/demo/ai-config" element={<AIConfigDemo />} />
        <Route path="/rest-api" element={<RestApi />} />
        <Route path="/cli" element={<Cli />} />
        <Route path="/coverage" element={<Coverage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}

// Gates rendering on the SDK's initialization status. In v4 this is a hook
// (useInitializationStatus) rather than awaiting the provider — the provider is
// created synchronously and reports { status: 'initializing' | 'ready' | 'failed' }.
function Gate() {
  const { status, error } = useInitializationStatus();

  // In LIVE mode a failed init is worth surfacing loudly (bad key, network,
  // etc.). In OFFLINE/mock mode we bootstrap known values, so a "failed" status
  // just means the SDK couldn't reach LD — expected — so we render normally.
  if (status === 'failed' && !IS_OFFLINE) {
    return (
      <div className="boot-screen boot-error">
        <h1>Failed to initialize LaunchDarkly</h1>
        <pre>{String(error?.message || error || 'unknown error')}</pre>
        <p>
          The app still works in offline mode — clear REACT_APP_LD_CLIENT_ID to
          force it. Rendering with default/cached values below.
        </p>
        <AppRoutes />
      </div>
    );
  }

  // Still connecting (live mode only — offline resolves immediately to a
  // terminal status via bootstrap).
  if (status === 'initializing') {
    return (
      <div className="boot-screen">
        <div className="boot-spinner">🚀</div>
        <p>Initializing LaunchDarkly SDK…</p>
      </div>
    );
  }

  // 'ready', or 'failed' while offline → render the app with bootstrap values.
  return <AppRoutes />;
}

export default function App() {
  return (
    <LDProvider>
      <Gate />
    </LDProvider>
  );
}
