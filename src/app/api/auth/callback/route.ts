import { NextResponse } from 'next/server';
import {
  getOfflineTokenForShop,
  getShopifyAppConfig,
  isValidShopDomain,
  saveOfflineToken,
  verifyShopifyHmac,
} from '@/app/lib/shopify/oauth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shop = (url.searchParams.get('shop') || '').trim();
  const host = (url.searchParams.get('host') || '').trim();
  const code = (url.searchParams.get('code') || '').trim();
  const state = (url.searchParams.get('state') || '').trim();

  const { clientId, clientSecret, appUrl, scopes } = getShopifyAppConfig();
  const cookieState = (req.headers.get('cookie') || '')
    .split(';')
    .map((s) => s.trim())
    .find((c) => c.startsWith('shopify_oauth_state='))
    ?.split('=')[1];

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { ok: false, error: 'Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET in .env (OAuth install requires both).' },
      { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
  if (!shop || !isValidShopDomain(shop)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid shop parameter.' },
      { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
  if (!code) {
    return NextResponse.json(
      { ok: false, error: 'Missing code parameter from Shopify.' },
      { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
  if (!state || !cookieState || state !== cookieState) {
    return NextResponse.json(
      { ok: false, error: 'OAuth state mismatch. Please retry install.' },
      { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
  if (!verifyShopifyHmac(url.searchParams, clientSecret)) {
    return NextResponse.json(
      { ok: false, error: 'HMAC verification failed.' },
      { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  const existing = getOfflineTokenForShop(shop);
  // If already installed, show existing token info
  if (existing) {
    return NextResponse.json(
      {
        ok: true,
        installed: true,
        shop,
        host,
        scope: existing.scope,
        obtainedAt: existing.obtainedAt,
        note: 'Offline token already stored on server.',
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  const tokenUrl = `https://${shop}/admin/oauth/access_token`;
  const tokenRes = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenJson = (await tokenRes.json().catch(() => null)) as
    | { access_token?: string; scope?: string; error?: string; error_description?: string }
    | null;

  if (!tokenRes.ok || !tokenJson?.access_token) {
    return NextResponse.json(
      {
        ok: false,
        error: tokenJson?.error_description || tokenJson?.error || `Token exchange failed (${tokenRes.status}).`,
        received: { shop, host, hasHmac: Boolean(url.searchParams.get('hmac')) },
        hint: 'Confirm SHOPIFY_CLIENT_SECRET is correct and the app is installed/authorized.',
      },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  saveOfflineToken({
    shop,
    accessToken: tokenJson.access_token,
    scope: tokenJson.scope || scopes,
    obtainedAt: new Date().toISOString(),
  });

  const res = NextResponse.json(
    {
      ok: true,
      installed: true,
      shop,
      host,
      scope: tokenJson.scope || scopes,
      next: {
        testAdmin: `/api/shopify/admin/test?draft=1&variantId=gid://shopify/ProductVariant/42616587681891`,
      },
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
  // clear state cookie
  res.cookies.set('shopify_oauth_state', '', { path: '/', maxAge: 0 });
  return res;
}
