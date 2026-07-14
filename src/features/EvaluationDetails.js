// SDK → Features → Flag variation evaluation details.
//
// variationDetail() returns not just the value but *why* the SDK returned it:
// the variationIndex and a `reason` object (FALLTHROUGH, RULE_MATCH,
// TARGET_MATCH, PREREQUISITE_FAILED, ERROR, OFF, …). Requires the SDK to be
// configured with evaluationReasons: true (see ldProvider.js).
import React, { useEffect, useState } from 'react';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { Page, Panel, Value, Code, Badge } from '../components/ui';
import { DEMO_FLAG_KEYS } from '../lib/config';

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
      // variationDetail returns { value, variationIndex, reason }.
      next[name] = ldClient.variationDetail(key, null);
    }
    setDetails(next);
  }, [ldClient]);

  return (
    <Page
      title="Evaluation details"
      subtitle="variationDetail() explains why each flag returned its value."
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
        <Code>{`// Configure the SDK with reasons enabled:
const ldClient = await asyncWithLDProvider({
  clientSideID, context,
  options: { evaluationReasons: true },
});

// Then read value + explanation together:
const detail = ldClient.variationDetail('release-banner', false);
// => { value: true, variationIndex: 0, reason: { kind: 'FALLTHROUGH' } }`}</Code>
        <p className="hint">
          Reason kinds: <code>OFF</code>, <code>FALLTHROUGH</code>,{' '}
          <code>TARGET_MATCH</code>, <code>RULE_MATCH</code>,{' '}
          <code>PREREQUISITE_FAILED</code>, <code>ERROR</code>.
        </p>
      </Panel>
    </Page>
  );
}
