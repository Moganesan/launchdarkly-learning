#!/usr/bin/env bash
# Toggle a flag on/off in an environment via the LaunchDarkly CLI.
# Usage: ./scripts/cli/toggle.sh <flag-key> on|off [project] [environment]
set -euo pipefail

FLAG="${1:?flag key required}"
STATE="${2:?on|off required}"
PROJECT="${3:-default}"
ENVIRONMENT="${4:-production}"

if [ "$STATE" = "on" ]; then FLAG_STATE="--on"; else FLAG_STATE="--off"; fi

echo "Turning $FLAG $STATE in $PROJECT/$ENVIRONMENT…"
ldcli flags toggle \
  --project "$PROJECT" \
  --flag "$FLAG" \
  --environment "$ENVIRONMENT" \
  $FLAG_STATE

echo "Verify: ldcli flags get --project $PROJECT --flag $FLAG"
