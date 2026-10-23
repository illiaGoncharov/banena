#!/usr/bin/env bash
# Upload ./out to Russian shared hosting via FTP/FTPS (Beget, Timeweb, etc.).
#
# Required env:
#   FTP_HOST       e.g. ftp.beget.com or server IP
#   FTP_USER
#   FTP_PASSWORD
#   FTP_REMOTE_DIR e.g. /banena.ru/public_html  or  /public_html
#
# Optional:
#   FTP_PORT       default 21
#   FTP_SSL        set to 1 for FTPS (explicit TLS)
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/out"

: "${FTP_HOST:?Missing FTP_HOST}"
: "${FTP_USER:?Missing FTP_USER}"
: "${FTP_PASSWORD:?Missing FTP_PASSWORD}"
: "${FTP_REMOTE_DIR:?Missing FTP_REMOTE_DIR}"
FTP_PORT="${FTP_PORT:-21}"

if [[ ! -f "$OUT/index.html" ]]; then
  echo "out/index.html missing — run: npm run build"
  exit 1
fi

if ! command -v lftp >/dev/null 2>&1; then
  echo "lftp is required. macOS: brew install lftp"
  exit 1
fi

# reg.ru and many RU hosts present FTPS with incomplete CA chains
SSL_OPTS="set ssl:verify-certificate no; set ftp:ssl-allow yes; set ftp:ssl-force false;"
if [[ "${FTP_SSL:-0}" == "1" ]]; then
  SSL_OPTS="${SSL_OPTS} set ftp:ssl-force true; set ftp:ssl-protect-data true;"
fi

echo "Deploying $OUT → ftp://${FTP_HOST}:${FTP_PORT}${FTP_REMOTE_DIR}"

lftp -c "
set cmd:fail-exit true;
set net:max-retries 2;
set net:timeout 20;
${SSL_OPTS}
open -u ${FTP_USER},${FTP_PASSWORD} -p ${FTP_PORT} ftp://${FTP_HOST};
mirror -R --delete --verbose --exclude-glob .DS_Store --exclude-glob CNAME ${OUT}/ ${FTP_REMOTE_DIR}/;
bye
"

echo "✓ Upload complete. Enable Let's Encrypt SSL in the hosting panel if not done yet."
