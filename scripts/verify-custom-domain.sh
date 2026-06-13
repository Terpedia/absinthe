#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HOSTNAME="$(tr -d '\r\n' < "$REPO_DIR/CNAME")"

echo "Hostname: $HOSTNAME"
echo

echo "DNS"
dig +short "$HOSTNAME" CNAME || true
dig +short "$HOSTNAME" A || true
echo

echo "GitHub Pages metadata"
gh api repos/Terpedia/nowhere/pages | jq '{status,cname,html_url,https_enforced}'
echo

echo "HTTP"
curl -I -L --max-time 20 "http://$HOSTNAME/" || true
echo

echo "HTTPS"
curl -I -L --max-time 20 "https://$HOSTNAME/" || true
echo

echo "Deep link checks"
curl -I -L --max-time 20 "https://$HOSTNAME/data/herbs.json" || true
curl -I -L --max-time 20 "https://$HOSTNAME/herbs/wormwood.html" || true
