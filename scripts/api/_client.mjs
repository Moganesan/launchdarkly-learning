// Shared LaunchDarkly REST API client used by every scripts/api/*.mjs file.
//
// - Reads config from .env (LD_API_TOKEN, LD_PROJECT_KEY, LD_ENVIRONMENT_KEY,
//   LD_API_BASE_URL).
// - If no token is set, runs in DRY-RUN mode: it prints the exact request it
//   would send and returns a stub, so the scripts are safe to run and read
//   without an account.
// - Uses Node 18+ native fetch (no dependencies).
//
// Docs: https://launchdarkly.com/docs/api  (auth, versioning, patch formats)

import 'dotenv/config';

const TOKEN = process.env.LD_API_TOKEN || '';
const BASE = (process.env.LD_API_BASE_URL || 'https://app.launchdarkly.com').replace(/\/$/, '');
export const PROJECT = process.env.LD_PROJECT_KEY || 'default';
export const ENVIRONMENT = process.env.LD_ENVIRONMENT_KEY || 'production';
export const DRY_RUN = !TOKEN;

// Pin an API version so responses are stable. Bump as LaunchDarkly evolves.
const API_VERSION = '20240415';

// Content types for the three PATCH styles LaunchDarkly supports.
export const CONTENT_TYPE = {
  json: 'application/json',
  jsonPatch: 'application/json',                                   // RFC 6902 [ {op,path,value} ]
  mergePatch: 'application/merge-patch+json',                      // RFC 7386
  semanticPatch: 'application/json; domain-model=launchdarkly.semanticpatch',
};

/**
 * Make an authenticated request to the LaunchDarkly API.
 * In dry-run mode it logs the request and returns { dryRun: true, ...echo }.
 */
export async function ld(method, path, { body, contentType } = {}) {
  const url = `${BASE}/api/v2${path}`;
  const headers = {
    Authorization: TOKEN,
    'LD-API-Version': API_VERSION,
    'Content-Type': contentType || CONTENT_TYPE.json,
  };

  if (DRY_RUN) {
    console.log('\n[DRY-RUN] would send:');
    console.log(`  ${method} ${url}`);
    console.log(`  Content-Type: ${headers['Content-Type']}`);
    if (body) console.log('  body:', JSON.stringify(body, null, 2));
    console.log('  (set LD_API_TOKEN in .env to execute for real)');
    return { dryRun: true, method, url, body };
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }

  if (!res.ok) {
    throw new Error(`LD API ${method} ${path} → ${res.status} ${res.statusText}\n${text}`);
  }
  return json;
}

// Convenience verb helpers.
export const get = (p) => ld('GET', p);
export const post = (p, body) => ld('POST', p, { body });
export const del = (p) => ld('DELETE', p);
export const patch = (p, body, style = 'json') =>
  ld('PATCH', p, { body, contentType: CONTENT_TYPE[style] });

// Pretty-print any result.
export function show(label, data) {
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(data, null, 2));
}

// Tiny arg parser: `node script.mjs <command> arg1 arg2`
export function args() {
  const [command, ...rest] = process.argv.slice(2);
  return { command: command || 'help', rest };
}
