/**
 * Cloudflare helpers for banena.ru RU-access fix.
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=... node scripts/cloudflare-ru-fix.mjs tweak
 *   CLOUDFLARE_API_TOKEN=... HOSTING_IP=1.2.3.4 node scripts/cloudflare-ru-fix.mjs point-dns
 *
 * Token needs: Zone.Zone Settings Edit, Zone.DNS Edit (zone banena.ru).
 */

const ZONE_NAME = "banena.ru";
const API = "https://api.cloudflare.com/client/v4";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing env: ${name}`);
    process.exit(1);
  }
  return value;
}

async function cf(path, { method = "GET", body, soft = false } = {}) {
  const token = requireEnv("CLOUDFLARE_API_TOKEN");
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!json.success) {
    if (soft) return null;
    console.error(JSON.stringify(json.errors ?? json, null, 2));
    process.exit(1);
  }
  return json.result;
}

async function getZoneId() {
  if (process.env.CLOUDFLARE_ZONE_ID) return process.env.CLOUDFLARE_ZONE_ID;
  const zones = await cf(`/zones?name=${ZONE_NAME}`);
  if (!zones.length) {
    console.error(`Zone not found: ${ZONE_NAME}`);
    process.exit(1);
  }
  return zones[0].id;
}

async function patchSetting(zoneId, settingId, value) {
  const result = await cf(`/zones/${zoneId}/settings/${settingId}`, {
    method: "PATCH",
    body: { value },
    soft: true,
  });
  if (!result) {
    // Some settings (ECH) may be missing on free plans — skip soft.
    console.warn(`⚠ skipped ${settingId} (not available on this plan)`);
    return;
  }
  console.log(`✓ ${settingId} → ${result.value}`);
}

/** Step 0: reduce DPI fingerprint surface (HTTP/3, 0-RTT, ECH). */
async function tweak() {
  const zoneId = await getZoneId();
  console.log(`Zone ${ZONE_NAME} (${zoneId})`);
  await patchSetting(zoneId, "http3", "off");
  await patchSetting(zoneId, "0rtt", "off");
  // Encrypted Client Hello — id varies; try common keys.
  await patchSetting(zoneId, "ech", "off");
  console.log("Done. Ask someone in RU (no VPN) to open https://banena.ru");
}

/**
 * Point apex (+ www) A records to Russian hosting IP, DNS-only (no proxy).
 * Removes old GitHub Pages A records for the apex.
 */
async function pointDns() {
  const hostingIp = requireEnv("HOSTING_IP");
  const zoneId = await getZoneId();
  const records = await cf(`/zones/${zoneId}/dns_records?per_page=100`);

  const apexA = records.filter(
    (r) => r.type === "A" && (r.name === ZONE_NAME || r.name === "@")
  );
  const wwwRecords = records.filter(
    (r) =>
      (r.type === "A" || r.type === "CNAME") &&
      (r.name === `www.${ZONE_NAME}` || r.name === "www")
  );

  for (const r of apexA) {
    console.log(`Deleting old A ${r.name} → ${r.content}`);
    await cf(`/zones/${zoneId}/dns_records/${r.id}`, { method: "DELETE" });
  }
  for (const r of wwwRecords) {
    console.log(`Deleting old ${r.type} ${r.name} → ${r.content}`);
    await cf(`/zones/${zoneId}/dns_records/${r.id}`, { method: "DELETE" });
  }

  await cf(`/zones/${zoneId}/dns_records`, {
    method: "POST",
    body: {
      type: "A",
      name: ZONE_NAME,
      content: hostingIp,
      ttl: 300,
      proxied: false,
    },
  });
  console.log(`✓ A ${ZONE_NAME} → ${hostingIp} (DNS only)`);

  await cf(`/zones/${zoneId}/dns_records`, {
    method: "POST",
    body: {
      type: "A",
      name: `www.${ZONE_NAME}`,
      content: hostingIp,
      ttl: 300,
      proxied: false,
    },
  });
  console.log(`✓ A www.${ZONE_NAME} → ${hostingIp} (DNS only)`);
}

const cmd = process.argv[2];
if (cmd === "tweak") {
  await tweak();
} else if (cmd === "point-dns") {
  await pointDns();
} else {
  console.log(`Usage:
  CLOUDFLARE_API_TOKEN=... node scripts/cloudflare-ru-fix.mjs tweak
  CLOUDFLARE_API_TOKEN=... HOSTING_IP=x.x.x.x node scripts/cloudflare-ru-fix.mjs point-dns`);
  process.exit(1);
}
