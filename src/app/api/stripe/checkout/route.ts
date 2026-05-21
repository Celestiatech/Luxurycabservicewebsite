import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeMode, getStripeSecretKey } from '@/app/lib/stripeConfig';
import { calculateFare } from '@/lib/fare';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type StripeCheckoutPayload = {
  booking?: {
    pickup?: string;
    dropoff?: string;
    date?: string;
    time?: string;
    passengers?: string;
    vehicleType?: string;
    vehicle?: string;
    name?: string;
    email?: string;
    phone?: string;
    specialRequests?: string;
  };
  pricing?: {
    distanceKm?: number | null;
    durationMinutes?: number | null;
    currency?: string;
    vehicleQuantity?: number | null;
  };
};

const toFiniteNumber = (value: unknown): number | null => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const trim = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const metadataValue = (value: unknown) => String(value ?? '').slice(0, 500);

export async function POST(req: Request) {
  try {
    let stripeSecretKey = '';
    let stripeMode = getStripeMode(process.env);
    try {
      stripeSecretKey = getStripeSecretKey(process.env);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Stripe is not configured.' },
        { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    const body = (await req.json().catch(() => ({}))) as StripeCheckoutPayload;
    const booking = body.booking || {};
    const pricing = body.pricing || {};

    const pickup = trim(booking.pickup);
    const dropoff = trim(booking.dropoff);
    const date = trim(booking.date);
    const time = trim(booking.time);
    const passengers = trim(booking.passengers);
    const vehicleType = trim(booking.vehicleType).toLowerCase();
    const vehicle = trim(booking.vehicle);
    const name = trim(booking.name);
    const email = trim(booking.email);
    const phone = trim(booking.phone);
    const specialRequests = trim(booking.specialRequests);

    if (!pickup || !dropoff || !date || !time || !passengers || !vehicle || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required booking details.' },
        { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    const distanceKm = toFiniteNumber(pricing.distanceKm);
    const durationMinutes = toFiniteNumber(pricing.durationMinutes);
    const rawVehicleQuantity = toFiniteNumber(pricing.vehicleQuantity);
    const vehicleQuantity = rawVehicleQuantity !== null && rawVehicleQuantity > 0 ? Math.floor(rawVehicleQuantity) : 1;
    const fareBreakdown = calculateFare({
      vehicleType,
      distanceKm,
      durationMinutes,
      time,
      vehicleQuantity,
    });

    if (!fareBreakdown) {
      return NextResponse.json(
        { error: 'Missing valid distance for fare calculation.' },
        { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const totalAmount = Math.max(1, fareBreakdown.total);
    const currency = trim(pricing.currency || process.env.STRIPE_CURRENCY || 'nzd').toLowerCase();
    const origin = new URL(req.url).origin;
    const checkoutMetadata = {
      booking_id: metadataValue(bookingId),
      stripe_mode: metadataValue(stripeMode),
      pickup: metadataValue(pickup),
      dropoff: metadataValue(dropoff),
      date: metadataValue(date),
      time: metadataValue(time),
      passengers: metadataValue(passengers),
      vehicle_type: metadataValue(vehicleType),
      vehicle: metadataValue(vehicle),
      name: metadataValue(name),
      email: metadataValue(email),
      phone: metadataValue(phone),
      special_requests: metadataValue(specialRequests),
      distance_km: metadataValue(distanceKm !== null ? distanceKm.toFixed(1) : ''),
      duration_minutes: metadataValue(durationMinutes !== null ? durationMinutes.toFixed(0) : ''),
      vehicle_quantity: metadataValue(fareBreakdown.vehicleQuantity),
      fare_rule: metadataValue(fareBreakdown.description),
      starting_fare: metadataValue(fareBreakdown.startingFare.toFixed(2)),
      base_amount: metadataValue(fareBreakdown.distanceAmount.toFixed(2)),
      fare_after_discount: metadataValue(fareBreakdown.baseFare.toFixed(2)),
      per_km_rate: metadataValue(fareBreakdown.distanceRate.toFixed(2)),
      fare_discount_rate: metadataValue(`${fareBreakdown.vehicleDiscountRate * 100}%`),
      discount_rate: metadataValue(`${fareBreakdown.vehicleDiscountRate * 100}%`),
      discount_amount: metadataValue(fareBreakdown.vehicleDiscountAmount.toFixed(2)),
      night_surcharge: metadataValue(fareBreakdown.nightSurcharge.toFixed(2)),
      traffic_surcharge: metadataValue(fareBreakdown.trafficSurcharge.toFixed(2)),
      total_amount: metadataValue(totalAmount.toFixed(2)),
    };

    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#booking`,
      phone_number_collection: { enabled: true },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: Math.round(totalAmount * 100),
            product_data: {
              name: vehicle || 'Affordable Cabs booking',
              description: `${pickup} to ${dropoff}`,
            },
          },
        },
      ],
      metadata: checkoutMetadata,
      payment_intent_data: {
        metadata: checkoutMetadata,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL.' },
        { status: 502, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    return NextResponse.json(
      {
        checkoutUrl: session.url,
        amount: totalAmount,
        currency,
      },
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
