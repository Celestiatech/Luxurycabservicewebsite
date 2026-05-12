import { NextResponse } from 'next/server';

type ShopifyMoneyV2 = { amount: string; currencyCode: string };
type ShopifyResponse = {
  data?: {
    products?: {
      nodes?: {
        title?: string;
        featuredImage?: { url?: string | null; altText?: string | null } | null;
        variants?: { nodes?: { id: string; title?: string; price?: ShopifyMoneyV2 }[] };
      }[];
    };
  };
  errors?: { message: string }[];
};

const productsQuery = `
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        title
        featuredImage {
          url
          altText
        }
        variants(first: 20) {
          nodes {
            id
            title
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function GET(req: Request) {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const apiVersion = process.env.SHOPIFY_API_VERSION?.trim() || '2024-10';

  if (!storeDomain || !storefrontAccessToken) {
    return NextResponse.json({ variants: [], error: 'Shopify is not configured.' }, { status: 200 });
  }

  try {
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
      body: JSON.stringify({ query: productsQuery, variables: { first: 30 } }),
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ variants: [], error: `Shopify API error (${res.status})` }, { status: 200 });
    }

    const json = (await res.json()) as ShopifyResponse;
    const gqlErrors = json.errors?.map((e) => e.message).filter(Boolean) || [];
    if (gqlErrors.length) {
      return NextResponse.json({ variants: [], error: gqlErrors.join('; ') }, { status: 200 });
    }

    const variants =
      json.data?.products?.nodes
        ?.flatMap((p) =>
          (p.variants?.nodes || []).map((v) => ({
            id: v.id,
            label: p.title ? (v.title && v.title !== 'Default Title' ? `${p.title} — ${v.title}` : p.title) : v.title || v.id,
            priceAmount: v.price?.amount || null,
            currencyCode: v.price?.currencyCode || null,
            imageUrl: (v as any)?.image?.url || p.featuredImage?.url || null,
            imageAlt: (v as any)?.image?.altText || p.featuredImage?.altText || p.title || null,
          })),
        )
        .filter((v) => typeof v.id === 'string' && v.id.startsWith('gid://')) || [];

    return NextResponse.json({ variants }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json({ variants: [], error: message }, { status: 200 });
  }
}
