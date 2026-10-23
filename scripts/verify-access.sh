#!/usr/bin/env bash
# Post-migration checks for banena.ru
set -euo pipefail

DOMAIN="${1:-banena.ru}"
EXPECTED_IP="${HOSTING_IP:-}"

echo "=== DNS A ==="
dig +short "$DOMAIN" A || true

if [[ -n "$EXPECTED_IP" ]]; then
  if dig +short "$DOMAIN" A | grep -qx "$EXPECTED_IP"; then
    echo "✓ DNS points to HOSTING_IP ($EXPECTED_IP)"
  else
    echo "✗ DNS does not match HOSTING_IP=$EXPECTED_IP (propagation or wrong record)"
  fi
  if dig +short "$DOMAIN" A | grep -Eq '^(104\.21\.|172\.67\.)'; then
    echo "✗ Still resolving to Cloudflare anycast — Proxy must be DNS-only / records wrong"
  fi
fi

echo ""
echo "=== HTTPS headers ==="
curl -sI --max-time 15 "https://$DOMAIN" | head -20 || true

echo ""
echo "=== HTTP status ==="
code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "https://$DOMAIN" || echo "000")
echo "https://$DOMAIN → $code"
if [[ "$code" == "200" ]]; then
  echo "✓ Origin responds 200"
else
  echo "✗ Expected 200"
fi

echo ""
echo "Manual RU check: https://check-host.net/check-http?host=https://${DOMAIN}"
echo "Pick Moscow/SPb nodes (MTS/Beeline/Rostelecom) — need OK/200 without VPN."
