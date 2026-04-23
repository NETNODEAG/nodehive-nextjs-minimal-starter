import { lookup } from 'node:dns/promises';

const MAX_REDIRECTS = 5;

// IPv4 ranges we refuse to contact. Covers RFC1918 private networks, loopback,
// link-local (including 169.254.0.0/16 where cloud-metadata services live),
// multicast, and reserved ranges. If a hostname's resolved address falls in
// any of these we reject — the public internet has no business living there.
const PRIVATE_IPV4_PATTERNS = [
  /^0\./, // "this network" / unspecified
  /^10\./, // RFC1918
  /^127\./, // loopback
  /^169\.254\./, // link-local (AWS/GCP/Azure metadata!)
  /^172\.(1[6-9]|2\d|3[01])\./, // RFC1918
  /^192\.168\./, // RFC1918
  /^22[4-9]\.|^2[3-5]\d\./, // multicast + reserved
];

function isPrivateAddress(ip: string): boolean {
  // IPv6 loopback / unspecified
  if (ip === '::' || ip === '::1') return true;
  // fe80::/10 — IPv6 link-local
  if (/^fe[89ab]/i.test(ip)) return true;
  // fc00::/7 — IPv6 unique-local
  if (/^f[cd]/i.test(ip)) return true;
  // IPv6-mapped IPv4 (::ffff:127.0.0.1): strip prefix and re-check against v4 patterns
  if (ip.toLowerCase().startsWith('::ffff:')) {
    const v4 = ip.slice(7);
    return PRIVATE_IPV4_PATTERNS.some((r) => r.test(v4));
  }
  return PRIVATE_IPV4_PATTERNS.some((r) => r.test(ip));
}

async function assertUrlIsPublic(url: URL): Promise<void> {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`Unsupported protocol: ${url.protocol}`);
  }
  const host = url.hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host.endsWith('.internal') ||
    host.endsWith('.local')
  ) {
    throw new Error(`Blocked hostname: ${host}`);
  }
  // Resolve DNS ourselves and check all returned addresses. Raises the
  // bar against DNS-rebinding but doesn't fully close it — fetch() does
  // a second lookup internally. Full fix would pin the IP via an undici
  // Dispatcher; acceptable risk for editor-only use.
  const addresses = await lookup(host, { all: true });
  if (addresses.length === 0) {
    throw new Error(`No addresses resolved for ${host}`);
  }
  for (const { address } of addresses) {
    if (isPrivateAddress(address)) {
      throw new Error(
        `Hostname ${host} resolved to private address ${address}`
      );
    }
  }
}

/**
 * fetch() replacement for user-influenced URLs. Blocks non-http(s) schemes,
 * private/loopback/link-local addresses, and re-validates every redirect
 * hop. Throws on any policy violation. See assertUrlIsPublic() for the
 * residual DNS-rebinding caveat.
 */
export async function safeExternalFetch(
  inputUrl: string,
  init: RequestInit = {}
): Promise<Response> {
  let currentUrl = new URL(inputUrl);
  let redirectsSeen = 0;

  while (true) {
    await assertUrlIsPublic(currentUrl);

    const response = await fetch(currentUrl, {
      ...init,
      redirect: 'manual',
    });

    // Not a 3xx — this is the final response
    if (response.status < 300 || response.status >= 400) {
      return response;
    }

    const location = response.headers.get('location');
    if (!location) return response;

    if (redirectsSeen++ >= MAX_REDIRECTS) {
      throw new Error('Too many redirects');
    }
    currentUrl = new URL(location, currentUrl);
  }
}
