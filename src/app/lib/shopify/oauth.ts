import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export type ShopifyOfflineTokenRecord = {
  shop: string;
  accessToken: string;
  scope: string;
  obtainedAt: string;
};

const TOKEN_FILE = path.join(process.cwd(), '.shopify-offline-tokens.json');

export function getEnv(name: string): string {
  return (process.env[name] || '').trim();
}

export function getShopifyAppConfig() {
  const clientId = getEnv('SHOPIFY_CLIENT_ID');
  const clientSecret = getEnv('SHOPIFY_CLIENT_SECRET');
  const appUrl = getEnv('SHOPIFY_APP_URL') || 'http://localhost:3000';
  const apiVersion = getEnv('SHOPIFY_ADMIN_API_VERSION') || getEnv('SHOPIFY_API_VERSION') || '2026-04';
  const scopes = getEnv('SHOPIFY_ADMIN_SCOPES') || 'read_products,write_draft_orders,read_draft_orders';
  return { clientId, clientSecret, appUrl, apiVersion, scopes };
}

export function generateNonce(bytes = 16) {
  return crypto.randomBytes(bytes).toString('hex');
}

export function isValidShopDomain(shop: string) {
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(shop);
}

export function signHmac(queryString: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(queryString).digest('hex');
}

export function verifyShopifyHmac(params: URLSearchParams, secret: string) {
  const provided = (params.get('hmac') || '').trim();
  if (!provided) return false;

  const pairs: string[] = [];
  // Shopify recommends: build message from all query params except hmac and signature, sorted lexicographically
  const keys = Array.from(params.keys())
    .filter((k) => k !== 'hmac' && k !== 'signature')
    .sort((a, b) => a.localeCompare(b));

  for (const k of keys) {
    const values = params.getAll(k);
    for (const v of values) pairs.push(`${k}=${v}`);
  }
  const message = pairs.join('&');
  const calculated = signHmac(message, secret);
  try {
    return crypto.timingSafeEqual(Buffer.from(calculated, 'utf8'), Buffer.from(provided, 'utf8'));
  } catch {
    return false;
  }
}

export function loadOfflineTokens(): Record<string, ShopifyOfflineTokenRecord> {
  try {
    const raw = fs.readFileSync(TOKEN_FILE, 'utf8');
    const json = JSON.parse(raw) as Record<string, ShopifyOfflineTokenRecord>;
    return json && typeof json === 'object' ? json : {};
  } catch {
    return {};
  }
}

export function saveOfflineToken(record: ShopifyOfflineTokenRecord) {
  const all = loadOfflineTokens();
  all[record.shop] = record;
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(all, null, 2), 'utf8');
}

export function getOfflineTokenForShop(shop: string): ShopifyOfflineTokenRecord | null {
  const all = loadOfflineTokens();
  return all[shop] || null;
}

