#!/bin/bash
# Install/reinstall the petition-engine dev-server LaunchAgent.
# After install, Next dev server starts on login and restarts if it crashes.

set -euo pipefail

LABEL="com.paulo.petitionengine.dev"
PLIST_SRC="$(cd "$(dirname "$0")" && pwd)/${LABEL}.plist"
PLIST_DST="$HOME/Library/LaunchAgents/${LABEL}.plist"
LOG_DIR="$HOME/Library/Logs"

mkdir -p "$HOME/Library/LaunchAgents"
mkdir -p "$LOG_DIR"

# Unload if already loaded (ignore errors if not loaded)
if launchctl list 2>/dev/null | grep -q "$LABEL"; then
  launchctl unload "$PLIST_DST" 2>/dev/null || true
fi

# Copy fresh
cp "$PLIST_SRC" "$PLIST_DST"
launchctl load "$PLIST_DST"

echo "✓ LaunchAgent $LABEL instalado em $PLIST_DST"
echo
echo "Verificar estado:"
echo "  launchctl list | grep $LABEL"
echo "  tail -f $LOG_DIR/petition-engine-dev.out.log"
echo
echo "Desinstalar:"
echo "  launchctl unload $PLIST_DST && rm $PLIST_DST"
