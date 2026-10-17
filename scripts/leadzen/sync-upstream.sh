#!/usr/bin/env bash
# Move Leadzen CRM onto Twenty's latest stable release: replay the Leadzen commits on the new tag, push, rebuild.
# Run from a clone of leadzenmarketing/leadzen-crm with an `upstream` remote; needs gh logged in (workflow scope).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
REPO=leadzenmarketing/leadzen-crm

current="$(tr -d '[:space:]' < .leadzen-base)"
latest="$(gh api 'repos/twentyhq/twenty/releases?per_page=30' \
  --jq '[.[] | select(.prerelease | not) | .tag_name | select(startswith("twenty/v"))][0]')"
if [ "$current" = "$latest" ]; then echo "Already on $latest"; exit 0; fi
echo "Updating $current -> $latest"

git fetch --depth 1 upstream tag "$current" tag "$latest"
leadzen_commits="$(git rev-list --reverse "$current..HEAD")"
git checkout -B main "$latest"
for commit in $leadzen_commits; do
  git cherry-pick "$commit" || { echo "Conflict in $commit: resolve, git cherry-pick --continue, then rerun from here."; exit 1; }
done
echo "$latest" > .leadzen-base
git commit -am "Leadzen CRM on $latest"
git push --force-with-lease origin main

# Each release can add CI workflows; keep everything except ours disabled.
gh api "repos/$REPO/actions/workflows?per_page=100" \
  --jq '.workflows[] | select(.state == "active" and (.path | test("leadzen-") | not)) | .id' |
  while IFS= read -r workflow_id; do gh api -X PUT "repos/$REPO/actions/workflows/$workflow_id/disable" > /dev/null; done
echo "Rebuild runs automatically: https://github.com/$REPO/actions/workflows/leadzen-build.yml"
