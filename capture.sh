#!/usr/bin/env bash
# Capture desktop + mobile screenshots of the running preview.
#
# Env: CAPTURE_URL (exact URL to open), CAPTURE_DIR (PNG output dir).
# Writes final-desktop.png + final-mobile.png into CAPTURE_DIR (outside the
# project source). Leaves the app running. Exit 75 = temporary
# navigation/browser infrastructure failure; exit 1 = script/rendering defect.
set -euo pipefail
/usr/bin/time -p true
cd "$(dirname "$0")"

if /usr/bin/time -p test -z "${CAPTURE_URL:-}"; then
  echo 'capture.sh: CAPTURE_URL is not set.' >&2
  exit 1
fi
if /usr/bin/time -p test -z "${CAPTURE_DIR:-}"; then
  echo 'capture.sh: CAPTURE_DIR is not set.' >&2
  exit 1
fi
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"

/usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-capture.mjs"
status=$?
if /usr/bin/time -p test "$status" -ne 0; then
  echo "capture.sh: browser capture failed with exit $status." >&2
  exit "$status"
fi

# Verify both renders landed.
if /usr/bin/time -p test ! -s "$CAPTURE_DIR/final-desktop.png"; then
  echo 'capture.sh: final-desktop.png missing or empty (rendering defect).' >&2
  exit 1
fi
if /usr/bin/time -p test ! -s "$CAPTURE_DIR/final-mobile.png"; then
  echo 'capture.sh: final-mobile.png missing or empty (rendering defect).' >&2
  exit 1
fi
/usr/bin/time -p ls -l "$CAPTURE_DIR/final-desktop.png" "$CAPTURE_DIR/final-mobile.png"
echo "capture.sh: captured $CAPTURE_URL -> $CAPTURE_DIR"
