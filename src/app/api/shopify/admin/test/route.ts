import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type AdminGqlResponse<T> = { data?: T; errors?: { message: string }[] };

async function adminGraphql<T>(args: { storeDomain: string; accessToken: string; apiVersion: string; query: string; variables?: any }) {
  const res = await fetch(`https://${args.storeDomain}/admin/api/${args.apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': args.accessToken,
    },
    body: JSON.stringify({ query: args.query, variables: args.variables || {} }),
    cache: 'no-store',
  });

  const text = await res.text();
  let json: AdminGqlResponse<T> | null = null;
  try {
    json = JSON.parse(text) as AdminGqlResponse<T>;
  } catch {
    // ignore
  }

  return { res, text, json };
}

export async function GET(req: Request) {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim() || '';
  const accessToken = process.env.SHOPIFY_APP_AUTOMATION_TOKEN?.trim() || '';
  const apiVersion = (process.env.SHOPIFY_ADMIN_API_VERSION?.trim() || process.env.SHOPIFY_API_VERSION?.trim() || '2025-01').trim();
  const defaultVariantId = process.env.SHOPIFY_DEFAULT_MERCHANDISE_ID?.trim() || '';

  if (!storeDomain || !accessToken) {
    return NextResponse.json(
      { ok: false, error: 'Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_APP_AUTOMATION_TOKEN.' },
      { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  const url = new URL(req.url);
  const doDraftTest = url.searchParams.get('draft') === '1';
  const variantId = (url.searchParams.get('variantId') || defaultVariantId).trim();

  const shopQuery = `query { shop { name primaryDomain { url } } }`;
  const shopResp = await adminGraphql<{ shop?: { name?: string; primaryDomain?: { url?: string } } }>({
    storeDomain,
    accessToken,
    apiVersion,
    query: shopQuery,
  });

  if (!shopResp.res.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Admin API request failed (${shopResp.res.status}).`,
        apiVersion,
        details: shopResp.text.slice(0, 500),
      },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  const gqlErrors = shopResp.json?.errors?.map((e) => e.message).filter(Boolean) || [];
  if (gqlErrors.length) {
    return NextResponse.json(
      { ok: false, error: gqlErrors.join('; '), apiVersion },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  const shopName = shopResp.json?.data?.shop?.name || null;
  const shopUrl = shopResp.json?.data?.shop?.primaryDomain?.url || null;

  if (!doDraftTest) {
    return NextResponse.json(
      { ok: true, adminApi: { apiVersion, shopName, shopUrl } },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  if (!variantId) {
    return NextResponse.json(
      {
        ok: false,
        adminApi: { apiVersion, shopName, shopUrl },
        error: 'Draft order test needs a variantId. Set SHOPIFY_DEFAULT_MERCHANDISE_ID or pass ?variantId=gid://shopify/ProductVariant/...',
      },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  const createMutation = `
    mutation DraftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder { id invoiceUrl }
        userErrors { field message }
      }
    }
  `;

  const created = await adminGraphql<{
    draftOrderCreate?: { draftOrder?: { id?: string; invoiceUrl?: string | null }; userErrors?: { message: string }[] };
  }>({
    storeDomain,
    accessToken,
    apiVersion,
    query: createMutation,
    variables: {
      input: {
        lineItems: [{ variantId, quantity: 1 }],
        note: 'Automation token draft-order test (auto-deleted).',
      },
    },
  });

  const createErrors = created.json?.errors?.map((e) => e.message).filter(Boolean) || [];
  const userErrors = created.json?.data?.draftOrderCreate?.userErrors?.map((e) => e.message).filter(Boolean) || [];
  if (!created.res.ok || createErrors.length || userErrors.length) {
    return NextResponse.json(
      {
        ok: false,
        adminApi: { apiVersion, shopName, shopUrl },
        draftTest: { ok: false },
        error:
          userErrors.join('; ') ||
          createErrors.join('; ') ||
          `Draft order create failed (${created.res.status}).`,
        details: created.text.slice(0, 500),
      },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  const draftId = created.json?.data?.draftOrderCreate?.draftOrder?.id || '';
  const invoiceUrl = created.json?.data?.draftOrderCreate?.draftOrder?.invoiceUrl || null;

  const deleteMutation = `
    mutation DraftOrderDelete($id: ID!) {
      draftOrderDelete(id: $id) {
        deletedId
        userErrors { field message }
      }
    }
  `;

  const deleted = await adminGraphql<{
    draftOrderDelete?: { deletedId?: string; userErrors?: { message: string }[] };
  }>({
    storeDomain,
    accessToken,
    apiVersion,
    query: deleteMutation,
    variables: { id: draftId },
  });

  const deleteErrors = deleted.json?.errors?.map((e) => e.message).filter(Boolean) || [];
  const deleteUserErrors = deleted.json?.data?.draftOrderDelete?.userErrors?.map((e) => e.message).filter(Boolean) || [];

  return NextResponse.json(
    {
      ok: true,
      adminApi: { apiVersion, shopName, shopUrl },
      draftTest: {
        ok: true,
        created: { id: draftId, invoiceUrl },
        deleted: {
          ok: deleted.res.ok && !deleteErrors.length && !deleteUserErrors.length,
          errors: [...deleteErrors, ...deleteUserErrors],
        },
      },
    },
    { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}

