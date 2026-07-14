import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { buildLDProvider } from './lib/ldProvider';
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

export default function App() {
  // The LD provider is created asynchronously (asyncWithLDProvider) so we can
  // await a ready client before first render. We hold it in state.
  const [LDProvider, setLDProvider] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    buildLDProvider()
      .then((Provider) => mounted && setLDProvider(() => Provider))
      .catch((e) => mounted && setError(e));
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="boot-screen boot-error">
        <h1>Failed to initialize LaunchDarkly</h1>
        <pre>{String(error?.message || error)}</pre>
        <p>The app still works in offline mode — clear REACT_APP_LD_CLIENT_ID to force it.</p>
      </div>
    );
  }

  if (!LDProvider) {
    return (
      <div className="boot-screen">
        <div className="boot-spinner">🚀</div>
        <p>Initializing LaunchDarkly SDK…</p>
      </div>
    );
  }

  return (
    <LDProvider>
      <AppRoutes />
    </LDProvider>
  );
}
