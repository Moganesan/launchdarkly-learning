#!/usr/bin/env bash
# Create all demo flags with the LaunchDarkly CLI (ldcli).
# Prereqs:
#   brew install launchdarkly/tap/ldcli   (or: npm i -g @launchdarkly/ldcli)
#   ldcli login                            (or export LD_ACCESS_TOKEN=api-xxxx)
#
# Usage: ./scripts/cli/setup-demo.sh [project-key]
set -euo pipefail

PROJECT="${1:-default}"

if ! command -v ldcli >/dev/null 2>&1; then
  echo "ldcli not found. Install it: brew install launchdarkly/tap/ldcli" >&2
  exit 1
fi

echo "Creating demo flags in project '$PROJECT' via ldcli…"

create() {  # create <key> <name> <variations-json>
  ldcli flags create --project "$PROJECT" \
    -d "{\"key\":\"$1\",\"name\":\"$2\",\"variations\":$3,\"clientSideAvailability\":{\"usingEnvironmentId\":true,\"usingMobileKey\":true}}" \
    || echo "  (flag $1 may already exist — continuing)"
}

create "release-banner" "Release banner" '[{"value":true},{"value":false}]'
create "theme-color"    "Theme color"    '[{"value":"#405BFF"},{"value":"#17A672"}]'
create "items-per-page" "Items per page" '[{"value":10},{"value":25},{"value":50}]'
create "beta-checkout"  "Beta checkout"  '[{"value":true},{"value":false}]'

echo "Done. List them with: ldcli flags list --project $PROJECT"
