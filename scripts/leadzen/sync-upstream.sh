#!/usr/bin/env bash
# Pull the latest Twenty main into Leadzen CRM and rebuild. Needs gh logged in with the workflow scope.
set -euo pipefail
REPO=leadzenmarketing/leadzen-crm

gh api -X POST "repos/$REPO/merge-upstream" -f branch=main --jq '.message'

# Upstream adds new CI workflows over time; keep everything except ours disabled.
gh workflow list -R "$REPO" --all --json name,path,state \
  --jq '.[] | select(.state == "active" and (.path | test("leadzen-") | not)) | .path' |
  while read -r workflow_path; do
    gh workflow disable -R "$REPO" "$(basename "$workflow_path")" && echo "disabled $workflow_path"
  done

gh workflow run -R "$REPO" leadzen-build.yml
echo "Rebuild started: https://github.com/$REPO/actions/workflows/leadzen-build.yml"
