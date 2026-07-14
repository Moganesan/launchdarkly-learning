import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// The app boots the LD provider asynchronously; in test/offline mode it falls
// back to the local bootstrap and should render the sidebar brand.
test('renders the LaunchDarkly demo shell', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  await waitFor(
    () => expect(screen.getByText(/LaunchDarkly/i)).toBeInTheDocument(),
    { timeout: 5000 }
  );
});
