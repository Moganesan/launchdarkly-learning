// SDK → Features → Flag variation evaluation details.
//
// variationDetail() returns not just the value but *why* the SDK returned it:
// the variationIndex and a `reason` object (FALLTHROUGH, RULE_MATCH,
// TARGET_MATCH, PREREQUISITE_FAILED, ERROR, OFF, …). Requires the SDK to be
// configured with withReasons: true (see ldProvider.js).
import React, { useEffect, useState } from 'react';
import { useLDClient } from '@launchdarkly/react-sdk';
import { Page, Panel, Value, Code, Badge } from '../components/ui';
import { DEMO_FLAG_KEYS, OFFLINE_BOOTSTRAP } from '../lib/config';

// v4 has no generic variationDetail(); pick the typed *VariationDetail method
// that matches the flag's value type. We derive the type + default from the
// bootstrap map (camelCase keys mirror DEMO_FLAG_KEYS).
function detailFor(ldClient, camelName, key) {
  const def = OFFLINE_BOOTSTRAP[camelName];
  switch (typeof def) {
    case 'boolean': return ldClient.boolVariationDetail(key, def);
    case 'number': return ldClient.numberVariationDetail(key, def);
    case 'string': return ldClient.stringVariationDetail(key, def);
    default: return ldClient.jsonVariationDetail(key, def ?? null);
  }
}

const REASON_TONE = {
  FALLTHROUGH: 'neutral',
  RULE_MATCH: 'ok',
  TARGET_MATCH: 'ok',
  PREREQUISITE_FAILED: 'warn',
  OFF: 'warn',
  ERROR: 'danger',
};

export default function EvaluationDetails() {
  const ldClient = useLDClient();
  const [details, setDetails] = useState({});

  useEffect(() => {
    if (!ldClient) return;
    const next = {};
    for (const [name, key] of Object.entries(DEMO_FLAG_KEYS)) {
      // Typed *VariationDetail returns { value, variationIndex, reason }.
      next[name] = detailFor(ldClient, name, key);
    }
    setDetails(next);
  }, [ldClient]);

  return (
    <Page
      title="Evaluation details"
      subtitle="Typed *VariationDetail methods explain why each flag returned its value."
      docPath="sdk/features/evaluation-reasons"
    >
      <Panel title="Per-flag evaluation reasons">
        {Object.entries(details).map(([name, d]) => (
          <div className="detail-row" key={name}>
            <div className="detail-head">
              <strong>{name}</strong>
              <Badge tone={REASON_TONE[d?.reason?.kind] || 'neutral'}>
                {d?.reason?.kind || 'n/a'}
              </Badge>
            </div>
            <Value label="value" value={d?.value} />
            <Value label="variationIndex" value={d?.variationIndex} />
            <Value label="reason" value={d?.reason} />
          </div>
        ))}
      </Panel>

      <Panel title="Code">
        <Code>{`// Configure the SDK with reasons enabled (v4 uses withReasons):
const LDProvider = createLDReactProvider(clientSideID, context, {
  ldOptions: { withReasons: true },
});

// Then read value + explanation together with a typed detail method:
const detail = ldClient.boolVariationDetail('release-banner', false);
// => { value: true, variationIndex: 0, reason: { kind: 'FALLTHROUGH' } }

// Or the hook form:
// const { value, variationIndex, reason } =
//   useBoolVariationDetail('release-banner', false);`}</Code>
        <p className="hint">
          Reason kinds: <code>OFF</code>, <code>FALLTHROUGH</code>,{' '}
          <code>TARGET_MATCH</code>, <code>RULE_MATCH</code>,{' '}
          <code>PREREQUISITE_FAILED</code>, <code>ERROR</code>.
        </p>
      </Panel>
    </Page>
  );
}
