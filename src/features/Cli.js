// Platform: LaunchDarkly CLI (ldcli). Documents scripts/cli.
import React from 'react';
import { Page, Panel, Code, Badge } from '../components/ui';

export default function Cli() {
  return (
    <Page
      title="LaunchDarkly CLI (ldcli)"
      subtitle="Install, authenticate, and manage flags from the terminal."
      docPath="home/getting-started/ldcli"
    >
      <Panel title="Install">
        <Code lang="bash">{`# macOS
brew install launchdarkly/tap/ldcli
# npm (cross-platform)
npm install -g @launchdarkly/ldcli
# Windows/Linux binaries: github.com/launchdarkly/ldcli/releases`}</Code>
      </Panel>

      <Panel title="Authenticate & configure">
        <Code lang="bash">{`ldcli login                              # browser OAuth
# or set a token explicitly:
ldcli config --set access-token api-xxxxxxxx
ldcli config --set output json
ldcli config --list
# env-var form (used by scripts/cli/*.sh):
export LD_ACCESS_TOKEN=api-xxxxxxxx`}</Code>
      </Panel>

      <Panel title="Guided setup (great first run)">
        <Code lang="bash">{`ldcli setup   # creates a flag, installs an SDK, toggles the flag end to end`}</Code>
      </Panel>

      <Panel title="Core resource commands">
        <Code lang="bash">{`# flags
ldcli flags create --project default -d '{"name":"Example flag","key":"example-flag"}'
ldcli flags list   --project default
ldcli flags update --project default --flag example-flag -d '{...}'
ldcli flags toggle --project default --flag example-flag --environment production --on
ldcli flags delete --project default --flag example-flag

# environments / projects / segments / members / experiments
ldcli environments get  --project default --environment production
ldcli experiments  list --project default --environment production
ldcli resources          # discover every available resource + operation`}</Code>
      </Panel>

      <Panel title="Local testing — dev-server">
        <Code lang="bash">{`# pull real flag values from a source env and serve them locally so you can
# test code paths without touching production:
ldcli dev-server --help
ldcli dev-server start --project default --source production

# upload source maps (for observability/session replay stack traces):
ldcli sourcemaps upload --app-version 1.4.0 --path ./build --project default`}</Code>
      </Panel>

      <Panel title="Wrapper scripts">
        <p>
          <Badge tone="neutral">scripts/cli/setup-demo.sh</Badge> creates all the
          demo flags via ldcli, and{' '}
          <Badge tone="neutral">scripts/cli/toggle.sh</Badge> flips one on/off.
        </p>
      </Panel>
    </Page>
  );
}
