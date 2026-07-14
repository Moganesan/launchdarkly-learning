# Observability

LaunchDarkly ships Observability SDKs and plugins that pair flag data with
telemetry. Docs: <https://launchdarkly.com/docs/sdk/observability>

## Observability plugins (browser)

`@launchdarkly/observability` and `@launchdarkly/session-replay` plug into the
React SDK to capture errors, performance, network, and full session replays —
correlated with the flags a user was served.

```js
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
// v4 supports plugins in options; wire Observability + SessionReplay plugins,
// then flag-change and evaluation data annotates your traces automatically.
```

Upload source maps so stack traces de-minify (see [cli.md](./cli.md)):

```bash
ldcli sourcemaps upload --app-version 1.4.0 --path ./build --project default
```

## OpenTelemetry

Server SDKs integrate with OpenTelemetry so flag evaluations appear as span
attributes/events in your existing tracing backend. Docs:
<https://launchdarkly.com/docs/sdk/features/otel>

## Relay Proxy

A service you host that sits between your SDKs and LaunchDarkly:

- **Fewer outbound connections** — SDKs connect to the proxy, not the internet.
- **Lower latency / caching** — serve flags from your network edge.
- **Enterprise controls** — required in locked-down environments.

Configure SDKs with `baseUri` / `streamUri` / `eventsUri` pointing at the proxy,
or run it in **daemon mode** backed by a persistent store. Docs:
<https://launchdarkly.com/docs/home/relay-proxy>

## Session & metrics correlation

Because evaluations, custom events, and (optionally) traces all carry the context
key, you can answer "did the users who saw variation B convert / error more?"
end to end — which is exactly what [experimentation](./experimentation.md) and
guarded rollouts automate.
