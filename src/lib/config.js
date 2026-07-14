// Central client-side configuration read from CRA environment variables.
// Only REACT_APP_* vars are available in the browser bundle.

export const LD_CLIENT_ID = process.env.REACT_APP_LD_CLIENT_ID || '';

// Offline/mock mode is on when explicitly forced OR when no client ID is set.
export const IS_OFFLINE =
  process.env.REACT_APP_LD_OFFLINE === 'true' || !LD_CLIENT_ID;

// The set of flag keys this demo references. When running offline we bootstrap
// these with sensible defaults so every page renders something meaningful.
// These keys are also the ones the /scripts create against your real project,
// so the app and the automation stay in sync.
export const DEMO_FLAG_KEYS = {
  releaseBanner: 'release-banner',        // boolean — show a release banner
  themeColor: 'theme-color',              // string  — primary UI color
  itemsPerPage: 'items-per-page',         // number  — pagination size
  checkoutConfig: 'checkout-config',      // json    — structured config object
  betaCheckout: 'beta-checkout',          // boolean — gated beta feature
  aiModelConfig: 'ai-model-config',       // json    — model config (AI Configs)
};

// Bootstrap values used in offline mode and as SDK defaults. Keys here are the
// camelCase form the React SDK produces from kebab-case flag keys by default.
export const OFFLINE_BOOTSTRAP = {
  releaseBanner: true,
  themeColor: '#405BFF',
  itemsPerPage: 10,
  checkoutConfig: {
    provider: 'stripe',
    currency: 'USD',
    express: true,
    retries: 3,
  },
  betaCheckout: false,
  aiModelConfig: {
    model: 'claude-opus-4-8',
    temperature: 0.7,
    maxTokens: 1024,
  },
};
