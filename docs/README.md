# LaunchDarkly demo — documentation

This folder documents **every** major LaunchDarkly capability and points to
where it is demonstrated in this repo (a live React page, a runnable script, or
a written explanation for dashboard/platform features).

| Doc | Covers |
|-----|--------|
| [react-sdk.md](./react-sdk.md) | Client-side React SDK: init, hooks, variations, contexts, events, streaming, bootstrap, inspectors, multi-env, status |
| [server-sdk.md](./server-sdk.md) | Server-side Node SDK + AI SDK: typed variations, allFlagsState, secure mode, TestData, AI Configs |
| [rest-api.md](./rest-api.md) | REST API: auth, versioning, patch formats, and every resource group with a runnable script |
| [cli.md](./cli.md) | `ldcli`: install, auth, flags, environments, setup, dev-server, sourcemaps |
| [targeting.md](./targeting.md) | Flag targeting: rules, individual targets, prerequisites, variations |
| [release-management.md](./release-management.md) | Progressive delivery, percentage rollouts, guarded releases, kill switches |
| [experimentation.md](./experimentation.md) | Metrics, experiments, holdouts, statistical analysis |
| [ai-configs.md](./ai-configs.md) | AI Configs, AI SDK, AgentControl, AI metrics |
| [segments.md](./segments.md) | Standard segments, Big Segments, sync'd segments |
| [governance.md](./governance.md) | Approvals, workflows, scheduling, RBAC/custom roles, SCIM, IP allowlisting |
| [integrations.md](./integrations.md) | Data Export, webhooks, code references, Slack/Jira/Okta, Terraform |
| [observability.md](./observability.md) | Observability SDK, session replay, OpenTelemetry, Relay Proxy |
| [advanced-sdk.md](./advanced-sdk.md) | OpenFeature, edge SDKs, Relay Proxy, migrations, offline/secure mode |
| [coverage.md](./coverage.md) | Master checklist mirroring the in-app Coverage page |

## Two ways to run

**Offline / mock (default, zero setup):** every React page renders from a local
bootstrap; every script runs in dry-run and prints the request it would send.

**Live (real account):** set credentials in `.env`, run `node scripts/api/seed.mjs`
to provision the flags, set `REACT_APP_LD_CLIENT_ID`, then `npm start`.

See the root [README.md](../README.md) for the full quick-start.

## Official docs

Everything here is distilled from <https://launchdarkly.com/docs/home>. Each doc
links back to the specific pages it summarizes.
