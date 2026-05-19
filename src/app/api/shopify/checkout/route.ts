import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type CartCreateResponse = {
  data?: {
    cartCreate?: {
      cart?: { checkoutUrl?: string | null };
      userErrors?: { field?: string[] | null; message: string }[];
    };
  };
  errors?: { message: string }[];
};

const cartCreateMutation = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function POST(req: Request) {
  try {
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
    const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
    const apiVersion = process.env.SHOPIFY_API_VERSION?.trim() || '2024-10';
    const defaultMerchandiseId = process.env.SHOPIFY_DEFAULT_MERCHANDISE_ID?.trim();

    if (!storeDomain || !storefrontAccessToken) {
      return NextResponse.json(
        {
          error:
            'Shopify is not configured on the server. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.',
        },
        { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      merchandiseId?: string | null;
      quantity?: number;
      attributes?: { key: string; value: string }[];
    };

    const merchandiseId = body.merchandiseId?.trim() || defaultMerchandiseId || '';
    if (!merchandiseId) {
      return NextResponse.json(
        {
          error:
            'Missing Shopify merchandiseId. Select a vehicle/product (recommended) or set SHOPIFY_DEFAULT_MERCHANDISE_ID in .env.',
        },
        { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }
    const quantity = typeof body.quantity === 'number' && body.quantity > 0 ? body.quantity : 1;
    const attributes = Array.isArray(body.attributes) ? body.attributes : [];

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (storefrontAccessToken.startsWith('shpat_')) {
      headers['Shopify-Storefront-Private-Token'] = storefrontAccessToken;
      const buyerIp =
        req.headers.get('shopify-storefront-buyer-ip') ||
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        req.headers.get('cf-connecting-ip');
      if (buyerIp) headers['Shopify-Storefront-Buyer-IP'] = buyerIp;
    } else {
      headers['X-Shopify-Storefront-Access-Token'] = storefrontAccessToken;
    }

    const res = await fetch(`https://${storeDomain}/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: cartCreateMutation,
        variables: {
          input: {
            lines: [{ merchandiseId, quantity }],
            attributes,
          },
        },
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Shopify API error (${res.status})` },
        { status: 502, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    const json = (await res.json()) as CartCreateResponse;
    const gqlErrors = json.errors?.map((e) => e.message).filter(Boolean) || [];
    if (gqlErrors.length) {
      return NextResponse.json(
        { error: gqlErrors.join('; ') },
        { status: 502, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    const userErrors = json.data?.cartCreate?.userErrors || [];
    if (userErrors.length) {
      return NextResponse.json(
        { error: userErrors.map((e) => e.message).join('; ') },
        { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    const checkoutUrl = json.data?.cartCreate?.cart?.checkoutUrl;
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Shopify did not return a checkout URL.' },
        { status: 502, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    return NextResponse.json(
      { checkoutUrl },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json(
      { error: message },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
