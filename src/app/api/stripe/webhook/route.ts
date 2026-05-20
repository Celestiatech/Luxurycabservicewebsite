import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  buildBookingAdminEmailHtml,
  buildBookingCustomerEmailHtml,
  buildBookingEmailText,
  type BookingEmailInput,
} from '@/lib/email/bookingTemplate';
import { createMailer, getSmtpConfigFromEnv } from '@/lib/email/mailer';
import { getStripeSecretKey, getStripeWebhookSecret } from '@/app/lib/stripeConfig';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const sentBookingIds = new Set<string>();

const metadata = (session: Stripe.Checkout.Session, key: string) => session.metadata?.[key] || '';

const moneyFromCents = (amount: number | null | undefined) =>
  typeof amount === 'number' && Number.isFinite(amount) ? (amount / 100).toFixed(2) : '';

const buildInput = (session: Stripe.Checkout.Session): BookingEmailInput => {
  const currency = (session.currency || metadata(session, 'currency') || 'nzd').toUpperCase();
  return {
    paymentStatus: session.payment_status || 'paid',
    paymentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.id,
    amount: moneyFromCents(session.amount_total),
    currency,
    pickup: metadata(session, 'pickup'),
    dropoff: metadata(session, 'dropoff'),
    date: metadata(session, 'date'),
    time: metadata(session, 'time'),
    passengers: metadata(session, 'passengers'),
    vehicleType: metadata(session, 'vehicle_type'),
    vehicle: metadata(session, 'vehicle'),
    vehicleQuantity: metadata(session, 'vehicle_quantity'),
    name: metadata(session, 'name'),
    email: metadata(session, 'email') || session.customer_details?.email || session.customer_email || '',
    phone: metadata(session, 'phone') || session.customer_details?.phone || '',
    specialRequests: metadata(session, 'special_requests'),
    distanceKm: metadata(session, 'distance_km'),
    durationMinutes: metadata(session, 'duration_minutes'),
    fareRule: metadata(session, 'fare_rule'),
    startingFare: metadata(session, 'starting_fare'),
    baseAmount: metadata(session, 'base_amount'),
    fareAfterDiscount: metadata(session, 'fare_after_discount'),
    perKmRate: metadata(session, 'per_km_rate'),
    discountRate: metadata(session, 'discount_rate'),
    discountAmount: metadata(session, 'discount_amount'),
    nightSurcharge: metadata(session, 'night_surcharge'),
    trafficSurcharge: metadata(session, 'traffic_surcharge'),
    totalAmount: metadata(session, 'total_amount') || moneyFromCents(session.amount_total),
  };
};

async function sendBookingEmails(session: Stripe.Checkout.Session) {
  const bookingId = metadata(session, 'booking_id') || session.id;
  if (sentBookingIds.has(bookingId)) return;

  const adminMail = (process.env.ADMIN_MAIL || '').trim();
  const input = buildInput(session);
  if (!adminMail || !input.email) {
    throw new Error('Missing ADMIN_MAIL or customer email for booking notification.');
  }

  const smtp = getSmtpConfigFromEnv(process.env);
  const transporter = createMailer(smtp);
  const text = buildBookingEmailText(input);
  const subject = `Booking confirmed: ${input.pickup || 'Pickup'} to ${input.dropoff || 'Drop-off'}`;

  await transporter.sendMail({
    from: smtp.from,
    to: adminMail,
    replyTo: input.email,
    subject: `New paid booking - ${input.name || 'Customer'}`,
    html: buildBookingAdminEmailHtml(input),
    text,
  });

  await transporter.sendMail({
    from: smtp.from,
    to: input.email,
    replyTo: adminMail,
    subject,
    html: buildBookingCustomerEmailHtml(input),
    text,
  });

  sentBookingIds.add(bookingId);
}

export async function POST(req: Request) {
  try {
    let stripeSecretKey = '';
    let webhookSecret = '';
    try {
      stripeSecretKey = getStripeSecretKey(process.env);
      webhookSecret = getStripeWebhookSecret(process.env);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Stripe webhook is not configured.' },
        { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === 'paid') {
        await sendBookingEmails(session);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json(
      { error: message },
      { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
