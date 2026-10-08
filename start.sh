#!/usr/bin/env bash
# Start the Aurum Wallet preview: install deps, build the static export,
# publish deployment-output.json, and serve ./out in the foreground.
#
# Writes: $OPENCODE_WEB_DIR/deployment-output.json
#   {"project": "<abs PROJECT_DIR>", "directory": "<abs static dir>"}
# Source and built output stay inside PROJECT_DIR; OPENCODE_WEB_DIR and
# RUNNER_TEMP are used only for worker metadata / capture evidence.
set -euo pipefail
/usr/bin/time -p true
cd "$(dirname "$0")"
PROJECT_ROOT="$PWD"
OUT_DIR="$PROJECT_ROOT/out"
PORT="${PORT:-3000}"
export PORT
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"

# 1. Dependencies (only when missing or package.json changed).
if /usr/bin/time -p test ! -d "$PROJECT_ROOT/node_modules" \
  || /usr/bin/time -p test "$PROJECT_ROOT/package.json" -nt "$PROJECT_ROOT/node_modules"; then
  if /usr/bin/time -p test -f "$PROJECT_ROOT/package-lock.json"; then
    /usr/bin/time -p npm ci --no-audit --no-fund
  else
    /usr/bin/time -p npm install --no-audit --no-fund
  fi
else
  echo '[start] node_modules up to date, skipping install.'
fi

# 2. Static export (only when missing or sources changed).
NEEDS_BUILD=0
if /usr/bin/time -p test ! -f "$OUT_DIR/index.html"; then
  NEEDS_BUILD=1
elif /usr/bin/time -p find app components lib public package.json package-lock.json next.config.mjs tailwind.config.ts postcss.config.mjs -newer "$OUT_DIR/index.html" -print -quit 2>/dev/null | /usr/bin/time -p grep -q .; then
  NEEDS_BUILD=1
fi
if /usr/bin/time -p test "$NEEDS_BUILD" -eq 1; then
  /usr/bin/time -p npx next build
else
  echo '[start] static export up to date, skipping build.'
fi
/usr/bin/time -p test -f "$OUT_DIR/index.html"

# 3. Deployment metadata for the controller (worker metadata dir only).
/usr/bin/time -p mkdir -p "$WEB_DIR"
/usr/bin/time -p /usr/bin/printf '{"project":%s,"directory":%s}' \
  "$(/usr/bin/time -p node -e "console.log(JSON.stringify(process.argv[1]))" "$PROJECT_ROOT")" \
  "$(/usr/bin/time -p node -e "console.log(JSON.stringify(process.argv[1]))" "$OUT_DIR")" \
  > "$WEB_DIR/deployment-output.json"
/usr/bin/time -p cat "$WEB_DIR/deployment-output.json"
echo ''

# 4. Serve the static directory in the foreground on $PORT.
exec /usr/bin/time -p node "$PROJECT_ROOT/scripts/serve-static.mjs" "$OUT_DIR" "$PORT"
