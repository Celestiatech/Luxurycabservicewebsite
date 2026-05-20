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

    if (!name) return NextResponse.json({ ok: false, error: 'Name is required.' }, { status: 400 });
    if (!email || !isEmail(email)) return NextResponse.json({ ok: false, error: 'Valid email is required.' }, { status: 400 });
    if (!phone) return NextResponse.json({ ok: false, error: 'Phone is required.' }, { status: 400 });

    const adminMail = (process.env.ADMIN_MAIL || '').trim();
    if (!adminMail || !isEmail(adminMail)) {
      return NextResponse.json({ ok: false, error: 'ADMIN_MAIL is not configured.' }, { status: 500 });
    }

    const smtp = getSmtpConfigFromEnv(process.env);
    const transporter = createMailer(smtp);

    const subject = `New Inquiry: ${name}${pickup || dropoff ? ` (${pickup || '-'} → ${dropoff || '-'})` : ''}`;
    const html = buildInquiryEmailHtml({
      name,
      email,
      phone,
      pickup,
      dropoff,
      message,
      source: 'Quick Inquiry Form',
    });

    await transporter.sendMail({
      from: smtp.from,
      to: adminMail,
      subject,
      replyTo: email,
      html,
      text: `New inquiry\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPickup: ${pickup}\nDrop-off: ${dropoff}\nMessage: ${message}\n`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to send inquiry.' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}

