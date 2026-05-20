export type StripeCheckoutBooking = {
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  passengers: string;
  vehicleType: string;
  vehicle: string;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
};

export async function createStripeCheckoutUrl(args: {
  booking: StripeCheckoutBooking;
  pricing: {
    distanceKm?: number | null;
    durationMinutes?: number | null;
    currency?: string;
    vehicleQuantity?: number | null;
  };
}): Promise<string> {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });

  const json = (await res.json().catch(() => null)) as { checkoutUrl?: string; error?: string } | null;
  if (!res.ok) {
    throw new Error(json?.error || 'Failed to start Stripe checkout.');
  }
  if (!json?.checkoutUrl) throw new Error('Stripe did not return a checkout URL.');
  return json.checkoutUrl;
}
