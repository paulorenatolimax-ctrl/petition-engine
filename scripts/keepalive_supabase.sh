#!/bin/bash
# Keepalive ping for Supabase — prevents automatic pausing
# Run weekly via cron: 0 9 * * 1 /path/to/keepalive_supabase.sh

SUPABASE_URL="https://dmqruovtiivgaqoronvh.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcXJ1b3Z0aWl2Z2Fxb3JvbnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjU5OTMsImV4cCI6MjA4OTc0MTk5M30.2Dffa1HLnIzpDXd6vwMwL4X9wMH5dX8tCBa9UBBXlgk"

response=$(curl -s -o /dev/null -w "%{http_code}" \
  "${SUPABASE_URL}/rest/v1/clients?select=id&limit=1" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}")

if [ "$response" = "200" ]; then
  echo "$(date): Supabase keepalive OK (HTTP $response)"
else
  echo "$(date): Supabase keepalive FAILED (HTTP $response)"
fi
