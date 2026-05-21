#!/bin/bash
# VNC Server Setup for macOS GitHub Actions Runner
set -e

VNC_PASSWORD="${1:-xcode123}"
VNC_PORT="${2:-5900}"
NOVNC_PORT="${3:-800}"

echo "🖥️ Setting up VNC Server..."

# Enable macOS Screen Sharing
sudo /System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart \
  -activate -configure -access -on \
  -configure -allowAccessFor -allUsers \
  -configure -restart -agent -privs -all \
  -configure -clientopts -setvnclegacy -vnclegacy yes \
  -configure -clientopts -setvncpw -vncpw "$VNC_PASSWORD" \
  2>/dev/null || echo "⚠️ kickstart issues, trying alt method..."

sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.screensharing.plist 2>/dev/null || true

sleep 2
echo "✅ VNC server configured on port $VNC_PORT"

# Install noVNC
if [ ! -d "$HOME/noVNC" ]; then
  cd "$HOME"
  git clone --depth 1 https://github.com/novnc/noVNC.git
fi

# Start noVNC proxy
cd "$HOME/noVNC"
./utils/novnc_proxy --vnc localhost:$VNC_PORT --listen $NOVNC_PORT --web "$HOME/noVNC" &
sleep 3
echo "✅ noVNC running at http://localhost:$NOVNC_PORT"
