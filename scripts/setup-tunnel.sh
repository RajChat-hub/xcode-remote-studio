#!/bin/bash
# Cloudflare Tunnel Setup Script
set -e

PORT="${1:-800}"
TUNNEL_TOKEN="${2:-}"

echo "🚇 Setting up Cloudflare Tunnel..."

# Install cloudflared
if ! command -v cloudflared &> /dev/null; then
  brew install cloudflare/cloudflare/cloudflared
fi

if [ -n "$TUNNEL_TOKEN" ]; then
  echo "🔑 Starting named tunnel..."
  cloudflared tunnel --no-autoupdate run --token "$TUNNEL_TOKEN" &
  echo "✅ Named tunnel started"
else
  echo "🆓 Starting quick tunnel..."
  cloudflared tunnel --no-autoupdate --url http://localhost:$PORT \
    --logfile $HOME/cloudflared.log &
  sleep 15
  
  TUNNEL_URL=$(grep -o 'https://[a-zA-Z0-9\-]*\.trycloudflare\.com' $HOME/cloudflared.log 2>/dev/null | head -1)
  
  if [ -n "$TUNNEL_URL" ]; then
    echo "✅ Tunnel URL: $TUNNEL_URL"
  else
    echo "⚠️ Could not extract URL. Check $HOME/cloudflared.log"
  fi
fi
