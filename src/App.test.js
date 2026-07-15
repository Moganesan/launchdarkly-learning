import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// The app boots the v4 LD provider synchronously and gates on
// useInitializationStatus(). In the jsdom test environment the offline client
// resolves to `failed` (no web-crypto), and our Gate renders the app routes in
// that branch too — so the sidebar brand should appear either way.
test('renders the LaunchDarkly demo shell', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  await waitFor(
    () => expect(screen.getAllByText(/LaunchDarkly/i).length).toBeGreaterThan(0),
    { timeout: 8000, interval: 200 }
  );
});
