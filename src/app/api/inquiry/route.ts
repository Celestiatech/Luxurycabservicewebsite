import { NextResponse } from 'next/server';
import { buildInquiryEmailHtml } from '@/lib/email/inquiryTemplate';
import { createMailer, getSmtpConfigFromEnv } from '@/lib/email/mailer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type InquiryPayload = {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  dropoff: string;
  message: string;
  source?: string;
  date?: string;
  pickupTime?: string;
  dropTime?: string;
  passengers?: string;
  vehicleType?: string;
  vehicle?: string;
  vehicleQuantity?: string;
  distance?: string;
  driveTime?: string;
  estimatedTotal?: string;
  fareRule?: string;
  couponCode?: string;
  startingFare?: string;
  distanceFare?: string;
  discount?: string;
  nightSurcharge?: string;
  trafficSurcharge?: string;
  specialRequests?: string;
};

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<InquiryPayload>;

    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const pickup = (body.pickup || '').trim();
    const dropoff = (body.dropoff || '').trim();
    const message = (body.message || '').trim();
    const source = (body.source || 'Quick Inquiry Form').trim();
    const date = (body.date || '').trim();
    const pickupTime = (body.pickupTime || '').trim();
    const dropTime = (body.dropTime || '').trim();
    const passengers = (body.passengers || '').trim();
    const vehicleType = (body.vehicleType || '').trim();
    const vehicle = (body.vehicle || '').trim();
    const vehicleQuantity = (body.vehicleQuantity || '').trim();
    const distance = (body.distance || '').trim();
    const driveTime = (body.driveTime || '').trim();
    const estimatedTotal = (body.estimatedTotal || '').trim();
    const fareRule = (body.fareRule || '').trim();
    const couponCode = (body.couponCode || '').trim();
    const startingFare = (body.startingFare || '').trim();
    const distanceFare = (body.distanceFare || '').trim();
    const discount = (body.discount || '').trim();
    const nightSurcharge = (body.nightSurcharge || '').trim();
    const trafficSurcharge = (body.trafficSurcharge || '').trim();
    const specialRequests = (body.specialRequests || '').trim();

    if (!name) return NextResponse.json({ ok: false, error: 'Name is required.' }, { status: 400 });
    if (!email || !isEmail(email)) return NextResponse.json({ ok: false, error: 'Valid email is required.' }, { status: 400 });
    if (!phone) return NextResponse.json({ ok: false, error: 'Phone is required.' }, { status: 400 });

    const adminMail = (process.env.ADMIN_MAIL || '').trim();
    if (!adminMail || !isEmail(adminMail)) {
      return NextResponse.json({ ok: false, error: 'ADMIN_MAIL is not configured.' }, { status: 500 });
    }

    const smtp = getSmtpConfigFromEnv(process.env);
    const transporter = createMailer(smtp);

    const isBooking = source === 'Booking Form' || source === 'Booking Quote Form';
    const subjectPrefix = isBooking ? 'New Quote Request' : 'New Inquiry';
    const subject = `${subjectPrefix}: ${name}${pickup || dropoff ? ` (${pickup || '-'} to ${dropoff || '-'})` : ''}`;
    const html = buildInquiryEmailHtml({
      name,
      email,
      phone,
      pickup,
      dropoff,
      message,
      source,
      date,
      pickupTime,
      dropTime,
      passengers,
      vehicleType,
      vehicle,
      vehicleQuantity,
      distance,
      driveTime,
      estimatedTotal,
      fareRule,
      couponCode,
      startingFare,
      distanceFare,
      discount,
      nightSurcharge,
      trafficSurcharge,
      specialRequests,
    });

    await transporter.sendMail({
      from: smtp.from,
      to: adminMail,
      subject,
      replyTo: email,
      html,
      text: [
        subjectPrefix,
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Pickup: ${pickup}`,
        `Drop-off: ${dropoff}`,
        date ? `Pickup date: ${date}` : '',
        pickupTime ? `Pickup time: ${pickupTime}` : '',
        dropTime ? `Drop-off time: ${dropTime}` : '',
        distance ? `Total distance: ${distance}` : '',
        driveTime ? `Drive time: ${driveTime}` : '',
        passengers ? `Passengers: ${passengers}` : '',
        vehicleType ? `Vehicle type: ${vehicleType}` : '',
        vehicle ? `Vehicle: ${vehicle}` : '',
        vehicleQuantity ? `Vehicle quantity: ${vehicleQuantity}` : '',
        estimatedTotal ? `Calculated total: ${estimatedTotal}` : '',
        fareRule ? `Fare rule: ${fareRule}` : '',
        couponCode ? `Coupon: ${couponCode}` : '',
        startingFare ? `Starting fare: ${startingFare}` : '',
        distanceFare ? `Distance fare: ${distanceFare}` : '',
        discount ? `Discount: ${discount}` : '',
        nightSurcharge ? `Night surcharge: ${nightSurcharge}` : '',
        trafficSurcharge ? `Traffic surcharge: ${trafficSurcharge}` : '',
        specialRequests ? `Special requests: ${specialRequests}` : '',
        `Message: ${message}`,
      ].filter(Boolean).join('\n'),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to send inquiry.' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
