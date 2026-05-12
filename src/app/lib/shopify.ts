export type ShopifyCartAttribute = { key: string; value: string };

function toAttributes(payload: Record<string, unknown>): ShopifyCartAttribute[] {
  return Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([key, value]) => ({ key, value: String(value) }));
}

export async function createShopifyCheckoutUrl(args: {
  merchandiseId?: string | null;
  quantity?: number;
  attributes?: Record<string, unknown>;
}): Promise<string> {
  const res = await fetch('/api/shopify/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchandiseId: args.merchandiseId || null,
      quantity: args.quantity || 1,
      attributes: toAttributes(args.attributes || {}),
    }),
  });

  const json = (await res.json().catch(() => null)) as { checkoutUrl?: string; error?: string } | null;
  if (!res.ok) {
    throw new Error(json?.error || 'Failed to start Shopify checkout.');
  }
  if (!json?.checkoutUrl) throw new Error('Shopify did not return a checkout URL.');
  return json.checkoutUrl;
}
