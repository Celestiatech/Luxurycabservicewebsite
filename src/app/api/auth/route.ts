import { NextResponse } from 'next/server';
import { generateNonce, getShopifyAppConfig, isValidShopDomain } from '@/app/lib/shopify/oauth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shop = (url.searchParams.get('shop') || '').trim();
  const { clientId, appUrl, scopes } = getShopifyAppConfig();

  if (!clientId) {
    return NextResponse.json(
      { ok: false, error: 'Missing SHOPIFY_CLIENT_ID in .env (OAuth install requires it).' },
      { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  if (!shop || !isValidShopDomain(shop)) {
    return NextResponse.json(
      { ok: false, error: 'Missing or invalid shop. Use ?shop=your-store.myshopify.com' },
      { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  const state = generateNonce(16);
  const redirectUri = `${appUrl.replace(/\/$/, '')}/api/auth/callback`;

  const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);

  const res = NextResponse.redirect(authUrl.toString());
  res.cookies.set('shopify_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 10,
  });
  return res;
}

