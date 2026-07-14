#!/usr/bin/env node
// Feature flags REST API.
// Docs: https://launchdarkly.com/docs/api/feature-flags
//
// Usage:
//   node scripts/api/flags.mjs list
//   node scripts/api/flags.mjs get     <flag-key>
//   node scripts/api/flags.mjs create  <flag-key> "<name>" [bool|string|number|json]
//   node scripts/api/flags.mjs rename  <flag-key> "<new name>"
//   node scripts/api/flags.mjs toggle  <flag-key> on|off   [env]
//   node scripts/api/flags.mjs rollout <flag-key> <pct>    [env]
//   node scripts/api/flags.mjs delete  <flag-key>
import { get, post, patch, del, show, args, PROJECT, ENVIRONMENT } from './_client.mjs';

const { command, rest } = args();

// Variation presets for the four flag value types.
const VARIATIONS = {
  bool: [{ value: true }, { value: false }],
  string: [{ value: 'blue' }, { value: 'green' }],
  number: [{ value: 10 }, { value: 25 }],
  json: [{ value: { express: true } }, { value: { express: false } }],
};

async function main() {
  switch (command) {
    case 'list': {
      // GET /flags/{projectKey}
      const data = await get(`/flags/${PROJECT}?summary=true`);
      return show('flags', (data.items || []).map((f) => ({ key: f.key, name: f.name })) ?? data);
    }

    case 'get': {
      // GET /flags/{projectKey}/{featureFlagKey}
      return show('flag', await get(`/flags/${PROJECT}/${rest[0]}?env=${ENVIRONMENT}`));
    }

    case 'create': {
      const [key, name, type = 'bool'] = rest;
      // POST /flags/{projectKey}
      const body = {
        key,
        name: name || key,
        variations: VARIATIONS[type] || VARIATIONS.bool,
        // Expose to client-side (browser) SDKs — required for the React app.
        clientSideAvailability: { usingEnvironmentId: true, usingMobileKey: true },
        tags: ['demo'],
      };
      return show('created flag', await post(`/flags/${PROJECT}`, body));
    }

    case 'rename': {
      const [key, newName] = rest;
      // JSON Patch (RFC 6902): replace the name field.
      return show('renamed', await patch(
        `/flags/${PROJECT}/${key}`,
        [{ op: 'replace', path: '/name', value: newName }],
        'jsonPatch',
      ));
    }

    case 'toggle': {
      const [key, state, env = ENVIRONMENT] = rest;
      // Semantic patch: precise, intent-based instruction.
      const body = {
        environmentKey: env,
        instructions: [{ kind: state === 'on' ? 'turnFlagOn' : 'turnFlagOff' }],
      };
      return show(`toggled ${state}`, await patch(`/flags/${PROJECT}/${key}`, body, 'semanticPatch'));
    }

    case 'rollout': {
      const [key, pct, env = ENVIRONMENT] = rest;
      const p = Number(pct);
      // Semantic patch: set a percentage rollout on the flag's fallthrough.
      const body = {
        environmentKey: env,
        instructions: [{
          kind: 'updateFallthroughVariationOrRollout',
          rolloutWeights: { 0: p * 1000, 1: (100 - p) * 1000 }, // weights are in 1/1000 %
        }],
      };
      return show(`rollout ${pct}%`, await patch(`/flags/${PROJECT}/${key}`, body, 'semanticPatch'));
    }

    case 'delete': {
      // DELETE /flags/{projectKey}/{featureFlagKey}
      return show('deleted', await del(`/flags/${PROJECT}/${rest[0]}`));
    }

    default:
      console.log(`flags.mjs — feature flag CRUD + targeting
  list | get <key> | create <key> "<name>" [bool|string|number|json]
  rename <key> "<name>" | toggle <key> on|off [env] | rollout <key> <pct> [env] | delete <key>`);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
