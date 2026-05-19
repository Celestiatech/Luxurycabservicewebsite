import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ShopifyMoneyV2 = { amount: string; currencyCode: string };
type ShopifyProductNode = {
  title?: string;
  featuredImage?: { url?: string | null; altText?: string | null } | null;
  variants?: {
    nodes?: {
      id: string;
      title?: string;
      image?: { url?: string | null; altText?: string | null } | null;
      price?: ShopifyMoneyV2;
    }[];
  };
};
type ShopifyResponse = {
  data?: {
    taxi?: { products?: { nodes?: ShopifyProductNode[] } } | null;
    van?: { products?: { nodes?: ShopifyProductNode[] } } | null;
  };
  errors?: { message: string }[];
};

const productsQuery = `
  query ProductsByVehicleCollection($first: Int!, $variantsFirst: Int!) {
    taxi: collection(handle: "taxi") {
      products(first: $first) {
        nodes {
          title
          featuredImage {
            url
            altText
          }
          variants(first: $variantsFirst) {
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
    van: collection(handle: "van") {
      products(first: $first) {
        nodes {
          title
          featuredImage {
            url
            altText
          }
          variants(first: $variantsFirst) {
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
      body: JSON.stringify({ query: productsQuery, variables: { first: 30, variantsFirst: 20 } }),
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

    const toVariants = (products: ShopifyProductNode[] | undefined, vehicleType: 'taxi' | 'van') =>
      (products || [])
        .flatMap((p) =>
          (p.variants?.nodes || []).map((v) => ({
            id: v.id,
            label: p.title ? (v.title && v.title !== 'Default Title' ? `${p.title} - ${v.title}` : p.title) : v.title || v.id,
            vehicleType,
            collectionHandle: vehicleType,
            priceAmount: v.price?.amount || null,
            currencyCode: v.price?.currencyCode || null,
            imageUrl: v.image?.url || p.featuredImage?.url || null,
            imageAlt: v.image?.altText || p.featuredImage?.altText || p.title || null,
          })),
        )
        .filter((v) => typeof v.id === 'string' && v.id.startsWith('gid://'));

    const variants = [
      ...toVariants(json.data?.taxi?.products?.nodes, 'taxi'),
      ...toVariants(json.data?.van?.products?.nodes, 'van'),
    ];

    return NextResponse.json(
      { variants },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json(
      { variants: [], error: message },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
