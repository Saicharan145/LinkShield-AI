import type { ThreatIndicator, UrlDeconstructed } from '../types/threat.ts';

// Known reputable root domains to prevent false positives for authentic top sites
export const KNOWN_SAFE_DOMAINS = new Set([
  'google.com',
  'microsoft.com',
  'apple.com',
  'amazon.com',
  'github.com',
  'wikipedia.org',
  'paypal.com',
  'chase.com',
  'bankofamerica.com',
  'wellsfargo.com',
  'netflix.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'youtube.com',
  'cloudflare.com',
  'openai.com',
  'stripe.com',
  'gov',
  'edu',
]);

export const HIGH_RISK_TLDS = new Set([
  'xyz',
  'top',
  'click',
  'work',
  'icu',
  'tk',
  'ml',
  'ga',
  'cf',
  'gq',
  'rest',
  'casa',
  'monster',
  'buzz',
  'surf',
  'cam',
  'live',
  'fit',
]);

export const TARGET_BRAND_KEYWORDS = [
  { brand: 'PayPal', keywords: ['paypal', 'pay-pal', 'paypa1'] },
  { brand: 'Microsoft', keywords: ['microsoft', 'office365', 'outlook', 'onedrive', 'msft', 'live-login'] },
  { brand: 'Apple', keywords: ['apple', 'appleid', 'icloud', 'app-le'] },
  { brand: 'Google', keywords: ['google', 'gmail', 'google-drive', 'gdrive', 'googleaccount'] },
  { brand: 'Amazon', keywords: ['amazon', 'prime-video', 'amazon-pay', 'amzn'] },
  { brand: 'Chase Bank', keywords: ['chase', 'chasebank', 'jpmorgan'] },
  { brand: 'Bank of America', keywords: ['bankofamerica', 'bofa'] },
  { brand: 'Wells Fargo', keywords: ['wellsfargo', 'wells-fargo'] },
  { brand: 'Netflix', keywords: ['netflix', 'netf1ix'] },
  { brand: 'Meta / Facebook', keywords: ['facebook', 'instagram', 'whatsapp', 'meta-security'] },
  { brand: 'Cryptocurrency / Web3', keywords: ['metamask', 'binance', 'coinbase', 'phantom-wallet', 'trustwallet', 'opensea', 'ledger'] },
  { brand: 'DHL / FedEx / USPS', keywords: ['dhl-tracking', 'fedex-delivery', 'usps-track', 'parcel-delivery'] },
];

export const SUSPICIOUS_WORDS = [
  'login',
  'signin',
  'sign-in',
  'log-in',
  'verify',
  'verification',
  'security',
  'update',
  'confirm',
  'account',
  'banking',
  'secure',
  'wallet',
  'password',
  'recovery',
  'support',
  'suspended',
  'billing',
  'invoice',
  'auth',
  'credential',
  'unlock',
  'urgent',
  'validate',
  'claim',
  'claims',
];

export const KNOWN_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'is.gd',
  'buff.ly',
  'ow.ly',
  'cutt.ly',
  'rebrand.ly',
  'shorturl.at',
  'rb.gy',
  'tiny.cc',
]);

/**
 * Calculates Shannon entropy of a string (randomness measure).
 */
export function calculateEntropy(str: string): number {
  if (!str || str.length === 0) return 0;
  const len = str.length;
  const frequencies = new Map<string, number>();

  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }

  let entropy = 0;
  for (const count of frequencies.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(2));
}

/**
 * Deconstructs any input URL string into its structural components.
 */
export function deconstructUrl(inputUrl: string): UrlDeconstructed {
  let cleaned = inputUrl.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }

  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    // Basic fallback for malformed input
    return {
      raw: inputUrl,
      protocol: 'unknown:',
      hostname: inputUrl,
      subdomain: '',
      registeredDomain: inputUrl,
      tld: '',
      port: '',
      pathname: '/',
      search: '',
      hash: '',
      isIpAddress: false,
      hasPunycode: false,
      entropy: calculateEntropy(inputUrl),
      length: inputUrl.length,
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith('[') || /^[0-9a-fA-F:]+$/.test(hostname);
  const hasPunycode = hostname.includes('xn--') || /[^\u0000-\u007F]/.test(hostname);

  const parts = hostname.split('.');
  let tld = '';
  let registeredDomain = hostname;
  let subdomain = '';

  if (!isIpAddress && parts.length > 1) {
    // Simple 2-level or 1-level TLD heuristic (e.g. .co.uk, .com)
    const lastPart = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];
    const isDoubleTld = parts.length > 2 && ['co', 'com', 'org', 'net', 'edu', 'gov'].includes(secondLast) && lastPart.length <= 3;

    if (isDoubleTld) {
      tld = `${secondLast}.${lastPart}`;
      registeredDomain = `${parts[parts.length - 3]}.${tld}`;
      subdomain = parts.slice(0, parts.length - 3).join('.');
    } else {
      tld = lastPart;
      registeredDomain = `${secondLast}.${tld}`;
      subdomain = parts.slice(0, parts.length - 2).join('.');
    }
  }

  return {
    raw: inputUrl,
    protocol: parsed.protocol,
    hostname,
    subdomain,
    registeredDomain,
    tld,
    port: parsed.port,
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    isIpAddress,
    hasPunycode,
    entropy: calculateEntropy(hostname + parsed.pathname),
    length: cleaned.length,
  };
}

export interface HeuristicScanResult {
  deconstruction: UrlDeconstructed;
  rawScore: number; // 0 - 100
  indicators: ThreatIndicator[];
  detectedBrand: string | null;
  flags: string[];
}

/**
 * Executes static cybersecurity heuristic checks on the URL.
 */
export function runHeuristicRules(rawUrl: string): HeuristicScanResult {
  const deconstructed = deconstructUrl(rawUrl);
  const indicators: ThreatIndicator[] = [];
  const flags: string[] = [];
  let score = 0;
  let detectedBrand: string | null = null;

  const { hostname, subdomain, registeredDomain, tld, pathname, search, isIpAddress, hasPunycode, entropy, length, protocol, port } = deconstructed;
  const fullUrlLower = rawUrl.toLowerCase();

  // 1. Check if it's an authentic trusted domain
  const isWhitelistedDomain = KNOWN_SAFE_DOMAINS.has(registeredDomain) || (tld === 'gov' || tld === 'edu');
  const isWellKnownWhitelisted = isWhitelistedDomain && (subdomain === '' || subdomain === 'www' || subdomain === 'm' || !subdomain.includes('-'));

  // 2. IP Address Hostname
  if (isIpAddress) {
    score += 55;
    flags.push('Direct IP Address used as host (bypasses domain reputation)');
    indicators.push({
      id: 'ind-ip-host',
      name: 'IP Address as Hostname',
      severity: 'critical',
      detected: true,
      category: 'domain',
      description: 'The URL uses a raw numeric IP address instead of a registered domain name, a staple technique of attacker command-and-control and unmonitored phishing hosts.',
    });
  }

  // 3. Punycode / Homograph Attack
  if (hasPunycode) {
    score += 65;
    flags.push('Internationalized domain / Punycode characters detected');
    indicators.push({
      id: 'ind-punycode',
      name: 'Punycode / Homograph Spoofing',
      severity: 'critical',
      detected: true,
      category: 'domain',
      description: 'Host contains "xn--" punycode or lookalike foreign alphabet characters designed to visually deceive users into confusing spoofed domains with legitimate entities.',
    });
  }

  // 4. Embedded '@' symbol (Browser URL authority confusion)
  if (rawUrl.includes('@')) {
    score += 60;
    flags.push('Embedded userinfo "@" separator in URL');
    indicators.push({
      id: 'ind-at-symbol',
      name: 'URL Confusion (@ symbol)',
      severity: 'critical',
      detected: true,
      category: 'lexical',
      description: 'URLs with an "@" symbol cause browsers to treat characters before "@" as basic authentication credentials, hiding the real target server that follows.',
    });
  }

  // 5. Brand Impersonation in Subdomain or Path when domain is NOT authentic
  for (const b of TARGET_BRAND_KEYWORDS) {
    for (const kw of b.keywords) {
      const brandInSubdomain = subdomain.toLowerCase().includes(kw);
      const brandInDomain = registeredDomain.toLowerCase().includes(kw);
      const brandInPath = (pathname + search).toLowerCase().includes(kw);

      if (brandInSubdomain && !isWhitelistedDomain) {
        detectedBrand = b.brand;
        score += 50;
        flags.push(`Target brand "${b.brand}" masqueraded in subdomain (${subdomain})`);
        indicators.push({
          id: `ind-brand-subdomain-${b.brand}`,
          name: `Brand Impersonation in Subdomain: ${b.brand}`,
          severity: 'critical',
          detected: true,
          category: 'content',
          description: `The brand "${b.brand}" is planted into the subdomain of "${registeredDomain}". Victims see the familiar brand name first and mistake this for the real portal.`,
        });
        break;
      } else if (brandInDomain && !isWhitelistedDomain) {
        // Typosquatting or lookalike domain!
        detectedBrand = b.brand;
        score += 45;
        flags.push(`Typosquatting or brand mimicry in domain name (${registeredDomain})`);
        indicators.push({
          id: `ind-typosquat-${b.brand}`,
          name: `Domain Typosquatting: ${b.brand}`,
          severity: 'high',
          detected: true,
          category: 'domain',
          description: `The domain name appears engineered to resemble "${b.brand}" without being the legitimate registered brand entity.`,
        });
        break;
      } else if (brandInPath && !isWhitelistedDomain && (score > 20 || HIGH_RISK_TLDS.has(tld))) {
        detectedBrand = b.brand;
        score += 25;
        flags.push(`Brand keyword "${b.brand}" present in path on unverified domain`);
      }
    }
    if (detectedBrand) break;
  }

  // 6. Suspicious / Abused TLD
  if (HIGH_RISK_TLDS.has(tld)) {
    score += 25;
    flags.push(`High-risk Top-Level Domain (.${tld}) frequently leveraged by disposable campaigns`);
    indicators.push({
      id: 'ind-high-risk-tld',
      name: `High-Risk TLD (.${tld})`,
      severity: 'medium',
      detected: true,
      category: 'reputation',
      description: `The .${tld} top-level domain has historically elevated rates of phishing registrations due to low acquisition costs and minimal identity verification.`,
    });
  }

  // 7. Excessive Hyphenation in Hostname
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    score += 30;
    flags.push(`Excessive hyphens in hostname (${hyphenCount} hyphens)`);
    indicators.push({
      id: 'ind-excessive-hyphens',
      name: 'Excessive Hyphenation',
      severity: 'high',
      detected: true,
      category: 'lexical',
      description: 'Phishing domain names frequently chain multiple hyphenated words together to synthesize convincing phrases (e.g. "secure-account-login-support").',
    });
  } else if (hyphenCount >= 2 && !isWhitelistedDomain) {
    score += 15;
    flags.push('Multiple hyphens in domain');
  }

  // 8. Deep Subdomain Chaining
  const subParts = subdomain ? subdomain.split('.').filter(Boolean) : [];
  if (subParts.length >= 3 && !isWhitelistedDomain) {
    score += 30;
    flags.push(`Unusual subdomain nesting depth (${subParts.length} levels)`);
    indicators.push({
      id: 'ind-deep-subdomain',
      name: 'Deep Subdomain Chaining',
      severity: 'medium',
      detected: true,
      category: 'domain',
      description: `Host uses ${subParts.length} nested subdomain prefixes to visually push the real registered domain off mobile URL address bars.`,
    });
  }

  // 9. Suspicious Keywords (Security, Urgent, Login, Bank)
  const matchedKeywords: string[] = [];
  for (const word of SUSPICIOUS_WORDS) {
    if (fullUrlLower.includes(word) && (!isWhitelistedDomain || pathname.includes(word))) {
      matchedKeywords.push(word);
    }
  }

  if (matchedKeywords.length >= 3 && !isWhitelistedDomain) {
    score += 35;
    flags.push(`Multiple high-threat security keywords: ${matchedKeywords.slice(0, 4).join(', ')}`);
    indicators.push({
      id: 'ind-suspicious-keywords',
      name: 'Credential Harvesting Keywords',
      severity: 'high',
      detected: true,
      category: 'content',
      description: `URL contains multiple high-urgency keywords (${matchedKeywords.slice(0, 4).join(', ')}) characteristic of credential theft or account suspension scams.`,
    });
  } else if (matchedKeywords.length >= 1 && !isWhitelistedDomain) {
    score += 15;
    flags.push(`Security/auth keyword detected: ${matchedKeywords[0]}`);
  }

  // 10. URL Shortener / Redirection Cloaking
  if (KNOWN_SHORTENERS.has(hostname)) {
    score += 25;
    flags.push('Known URL shortener concealing actual landing destination');
    indicators.push({
      id: 'ind-shortener',
      name: 'URL Shortener Redirection Cloak',
      severity: 'medium',
      detected: true,
      category: 'protocol',
      description: 'URL shorteners obscure the real destination server, preventing instant visual verification and bypassing static email filters.',
    });
  }

  // 11. High Shannon Entropy (Randomized domains)
  if (entropy > 4.1 && !isWhitelistedDomain) {
    score += 25;
    flags.push(`Elevated string entropy (${entropy}) suggesting algorithmic domain generation`);
    indicators.push({
      id: 'ind-high-entropy',
      name: 'High Lexical Entropy (DGA Pattern)',
      severity: 'medium',
      detected: true,
      category: 'lexical',
      description: `Hostname and path exhibit an entropy score of ${entropy}, indicating randomized or algorithmically generated strings common in disposable botnet landing pages.`,
    });
  }

  // 12. Non-standard Port
  if (port && port !== '80' && port !== '443') {
    score += 30;
    flags.push(`Non-standard network port :${port}`);
    indicators.push({
      id: 'ind-port',
      name: `Non-Standard Web Port (:${port})`,
      severity: 'high',
      detected: true,
      category: 'protocol',
      description: `Legitimate enterprise web destinations typically route on default standard ports 80/443. Port :${port} often points to compromised servers or rogue listeners.`,
    });
  }

  // 13. Insecure HTTP Protocol
  if (protocol === 'http:' && (matchedKeywords.length > 0 || !isWhitelistedDomain)) {
    score += 20;
    flags.push('Unencrypted HTTP protocol in use');
    indicators.push({
      id: 'ind-http-insecure',
      name: 'Unencrypted HTTP Connection',
      severity: 'medium',
      detected: true,
      category: 'protocol',
      description: 'Connection is unencrypted, meaning data submitted is vulnerable to eavesdropping and lacks identity verification certificates.',
    });
  }

  // 14. Extreme URL Length
  if (length > 120 && !isWhitelistedDomain) {
    score += 15;
    flags.push(`Unusually long URL (${length} characters)`);
    indicators.push({
      id: 'ind-excessive-length',
      name: 'Abnormal URL Length',
      severity: 'low',
      detected: true,
      category: 'lexical',
      description: `URL is ${length} characters long, a pattern often used to hide the true destination past visible address bar cutoffs on mobile devices.`,
    });
  }

  // Whitelist discount if this is genuinely an authentic top-tier website
  if (isWellKnownWhitelisted) {
    score = Math.min(score, 5);
    indicators.push({
      id: 'ind-whitelisted-domain',
      name: 'Recognized Official Entity',
      severity: 'info',
      detected: true,
      category: 'domain',
      description: `The registered domain "${registeredDomain}" corresponds to a globally recognized top organization.`,
    });
  }

  // Normalize score between 0 and 100
  const finalScore = Math.min(Math.max(score, 0), 100);

  return {
    deconstruction: deconstructed,
    rawScore: finalScore,
    indicators,
    detectedBrand,
    flags,
  };
}
