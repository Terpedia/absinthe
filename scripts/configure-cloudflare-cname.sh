#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [[ -f "$REPO_DIR/CNAME" ]]; then
  TARGET_HOSTNAME="$(tr -d '\r\n' < "$REPO_DIR/CNAME")"
else
  echo "CNAME file is missing in $REPO_DIR" >&2
  exit 1
fi

if [[ "$TARGET_HOSTNAME" != *.* ]]; then
  echo "Invalid CNAME hostname: $TARGET_HOSTNAME" >&2
  exit 1
fi

RECORD_NAME="${RECORD_NAME:-${TARGET_HOSTNAME%%.*}}"
ZONE_NAME="${ZONE_NAME:-${TARGET_HOSTNAME#*.}}"
ZONE_NAME="${ZONE_NAME#*.}"
ZONE_NAME="${ZONE_NAME:-terpedia.com}"
CONTENT="${CONTENT:-terpedia.github.io}"
PROXIED="${PROXIED:-false}"
TOKEN="${CLOUDFLARE_API_TOKEN:-${CLOUDFLARE_TOKEN:-}}"

if [[ -z "$TOKEN" ]]; then
  echo "Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_TOKEN" >&2
  exit 1
fi

zone_lookup() {
  curl -fsS \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4/zones?name=$ZONE_NAME"
}

ZONE_ID="${CF_ZONE_ID:-}"
if [[ -z "$ZONE_ID" ]]; then
  ZONE_ID="$(zone_lookup | jq -r '.result[0].id // empty')"
fi

if [[ -z "$ZONE_ID" ]]; then
  echo "Could not resolve Cloudflare zone id for $ZONE_NAME" >&2
  exit 1
fi

record_lookup() {
  curl -fsS \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=CNAME&name=$TARGET_HOSTNAME"
}

payload="$(jq -n \
  --arg type "CNAME" \
  --arg name "$RECORD_NAME" \
  --arg content "$CONTENT" \
  --argjson proxied "$PROXIED" \
  '{type:$type,name:$name,content:$content,proxied:$proxied}')"

existing_id="$(record_lookup | jq -r '.result[0].id // empty')"

if [[ -n "$existing_id" ]]; then
  echo "Updating existing CNAME $TARGET_HOSTNAME -> $CONTENT"
  curl -fsS -X PUT \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$existing_id" \
    --data "$payload" \
    | jq '{success,result:{id:.result.id,name:.result.name,content:.result.content,proxied:.result.proxied}}'
else
  echo "Creating CNAME $TARGET_HOSTNAME -> $CONTENT"
  curl -fsS -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
    --data "$payload" \
    | jq '{success,result:{id:.result.id,name:.result.name,content:.result.content,proxied:.result.proxied}}'
fi
