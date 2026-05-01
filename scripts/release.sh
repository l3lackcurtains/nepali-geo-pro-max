#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/release.sh <patch|minor|major>
#
# Verifies the tree, bumps version, publishes to npm, and pushes commits + tag
# to GitHub. Run from anywhere inside the repo.

BUMP="${1:-}"
case "$BUMP" in
  patch|minor|major) ;;
  *)
    echo "Usage: $0 <patch|minor|major>" >&2
    exit 1
    ;;
esac

cd "$(git rev-parse --show-toplevel)"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "✗ Working tree not clean. Commit or stash first." >&2
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" && "$BRANCH" != "master" ]]; then
  echo "✗ Not on main/master (currently on $BRANCH)." >&2
  exit 1
fi

if ! npm whoami >/dev/null 2>&1; then
  echo "✗ Not logged in to npm. Run 'npm login'." >&2
  exit 1
fi

# Run checks before bumping so a failure doesn't leave an orphan version + tag.
echo "→ Running checks..."
npm run typecheck
npm test
npm run build

NEW_VERSION="$(npm version "$BUMP")"
echo "→ Bumped to $NEW_VERSION"

npm publish

git push --follow-tags

echo "✓ Published $NEW_VERSION and pushed to GitHub"
