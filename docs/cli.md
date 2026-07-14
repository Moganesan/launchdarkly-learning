# LaunchDarkly CLI (`ldcli`)

Docs: <https://launchdarkly.com/docs/home/getting-started/ldcli> ·
Commands: <https://launchdarkly.com/docs/home/getting-started/ldcli-commands> ·
Source: <https://github.com/launchdarkly/ldcli>

Wrapper scripts: [`scripts/cli/setup-demo.sh`](../scripts/cli/setup-demo.sh),
[`scripts/cli/toggle.sh`](../scripts/cli/toggle.sh).

## Install

```bash
brew install launchdarkly/tap/ldcli      # macOS
npm install -g @launchdarkly/ldcli        # cross-platform
# Windows/Linux binaries: github.com/launchdarkly/ldcli/releases
```

## Authenticate & configure

```bash
ldcli login                               # browser OAuth
ldcli config --set access-token api-xxxx  # or a token directly
ldcli config --set output json
ldcli config --list
export LD_ACCESS_TOKEN=api-xxxx           # env-var form (used by the .sh scripts)
```

Config file: `$XDG_CONFIG_HOME/ldcli/config.yml`. Set default `project`,
`environment`, `flag` there to avoid repeating flags.

## Guided setup

```bash
ldcli setup   # creates a flag, installs an SDK, and toggles it end to end
```

## Resource commands

```bash
# flags
ldcli flags create --project default -d '{"name":"Example","key":"example-flag"}'
ldcli flags list   --project default
ldcli flags update --project default --flag example-flag -d '{...}'
ldcli flags toggle --project default --flag example-flag --environment production --on
ldcli flags delete --project default --flag example-flag

# other resources
ldcli environments get  --project default --environment production
ldcli experiments  list --project default --environment production
ldcli resources          # discover every resource + operation
ldcli <command> --help   # usage for any command
```

## Local testing — `dev-server`

```bash
ldcli dev-server --help
ldcli dev-server start --project default --source production
# → pulls real flag values from a source env and serves them locally so you can
#   exercise code paths without touching production.
```

Reference: <https://launchdarkly.com/docs/guides/flags/ldcli-dev-server-reference>

## Source maps (for observability stack traces)

```bash
ldcli sourcemaps upload --app-version 1.4.0 --path ./build --project default
```

## This repo's scripts

```bash
./scripts/cli/setup-demo.sh default            # create all demo flags
./scripts/cli/toggle.sh beta-checkout on       # flip one flag on
```
