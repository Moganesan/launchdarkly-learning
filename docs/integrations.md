# Integrations

Docs: <https://launchdarkly.com/docs/integrations>

## Data Export

Stream flag evaluation + custom events to a destination for warehousing and
analysis: **Kinesis, Google Pub/Sub, Azure Event Hubs, mParticle, Segment,
generic HTTP**. Configure per environment. Enables offline experimentation and
BI on raw events.

## Webhooks

Fire an HTTP callback on any account change (flags, segments, members). Runnable:

```bash
node scripts/api/webhooks.mjs create https://example.com/ld-hook
node scripts/api/webhooks.mjs list
```

Optionally **sign** payloads (HMAC) so receivers can verify authenticity.

## Code references

The `ld find-code-refs` tool (and CI integrations) scans your repos for flag
keys so you can see where each flag is used and safely retire stale flags. Docs:
<https://launchdarkly.com/docs/home/code/code-references>

## App integrations

- **Slack / Microsoft Teams** — change notifications + approvals in chat.
- **Jira** — link flags to issues.
- **Datadog / Dynatrace / Honeycomb / New Relic / Sentry** — send flag-change
  events and observe impact on your telemetry.
- **Okta / Entra ID** — SSO + SCIM (see [governance.md](./governance.md)).
- **ServiceNow** — change-management approvals.

## Terraform provider

Manage projects, environments, flags, segments, and roles as code with the
official `launchdarkly/launchdarkly` Terraform provider — GitOps for flag config.

## Trigger URLs

Per-flag, tokenized URLs that toggle or change a flag when hit — wire an
observability alert (PagerDuty/Datadog) to auto-flip a kill switch.
