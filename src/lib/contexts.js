// Sample LaunchDarkly *contexts* used throughout the demo.
//
// LaunchDarkly's modern evaluation model uses "contexts" instead of "users".
// A context has a `kind` (user, organization, device, …) and a `key`. A
// *multi-context* bundles several single contexts together so you can target
// on any of them at once.
//
// Docs: SDK → Features → Context configuration.

// A single "user" context with standard + custom attributes.
export const userContext = {
  kind: 'user',
  key: 'user-abc-123',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  // Built-in attribute that keeps a value from being sent to LaunchDarkly.
  _meta: {
    privateAttributes: ['email'],
  },
  // Custom attributes — target rules can reference any of these.
  plan: 'enterprise',
  country: 'GB',
  betaOptIn: true,
};

// A second user, useful for demonstrating that identify() changes evaluations.
export const secondUserContext = {
  kind: 'user',
  key: 'user-xyz-789',
  name: 'Grace Hopper',
  email: 'grace@example.com',
  plan: 'free',
  country: 'US',
  betaOptIn: false,
};

// An anonymous context — no PII, LaunchDarkly can generate the key for you when
// `anonymous: true` and no key is supplied (client-side SDKs).
export const anonymousContext = {
  kind: 'user',
  anonymous: true,
};

// A multi-context: evaluate against a user AND their organization at once.
export const multiContext = {
  kind: 'multi',
  user: {
    key: 'user-abc-123',
    name: 'Ada Lovelace',
    plan: 'enterprise',
  },
  organization: {
    key: 'org-acme',
    name: 'Acme Corp',
    tier: 'platinum',
    seats: 500,
  },
  device: {
    key: 'device-ios-42',
    platform: 'iOS',
    version: '17.2',
  },
};

// Named presets shown in the context switcher UI.
export const CONTEXT_PRESETS = {
  'Ada (enterprise user)': userContext,
  'Grace (free user)': secondUserContext,
  'Anonymous': anonymousContext,
  'Multi (user + org + device)': multiContext,
};
