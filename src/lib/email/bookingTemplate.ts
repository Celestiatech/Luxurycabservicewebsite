export type BookingEmailInput = {
  paymentStatus: string;
  paymentId: string;
  amount: string;
  currency: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  passengers: string;
  vehicleType: string;
  vehicle: string;
  vehicleQuantity: string;
  name: string;
  email: string;
  phone: string;
  specialRequests: string;
  distanceKm: string;
  durationMinutes: string;
  fareRule: string;
  startingFare: string;
  baseAmount: string;
  fareAfterDiscount: string;
  perKmRate: string;
  discountRate: string;
  discountAmount: string;
  nightSurcharge: string;
  trafficSurcharge: string;
  totalAmount: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const money = (amount: string, currency: string) => {
  const parsed = Number(amount);
  if (!Number.isFinite(parsed)) return amount || '-';
  return `${currency.toUpperCase()} $${parsed.toFixed(2)}`;
};

const rows = (items: Array<{ label: string; value: string }>) =>
  items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:800;width:160px;vertical-align:top;">${escapeHtml(
            item.label,
          )}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#374151;vertical-align:top;">${escapeHtml(
            item.value || '-',
          ).replaceAll('\n', '<br>')}</td>
        </tr>`,
    )
    .join('');

export function buildBookingAdminEmailHtml(input: BookingEmailInput) {
  const tripRows = rows([
    { label: 'Pickup', value: input.pickup },
    { label: 'Drop-off', value: input.dropoff },
    { label: 'Date / Time', value: `${input.date} ${input.time}`.trim() },
    { label: 'Passengers', value: input.passengers },
    { label: 'Vehicle Type', value: input.vehicleType },
    { label: 'Vehicle', value: input.vehicle },
    { label: 'Vehicle Quantity', value: input.vehicleQuantity },
    { label: 'Distance', value: input.distanceKm ? `${input.distanceKm} km` : '-' },
    { label: 'Drive Time', value: input.durationMinutes ? `${input.durationMinutes} min` : '-' },
    { label: 'Special Requests', value: input.specialRequests },
  ]);

  const customerRows = rows([
    { label: 'Name', value: input.name },
    { label: 'Email', value: input.email },
    { label: 'Phone', value: input.phone },
  ]);

  const paymentRows = rows([
    { label: 'Payment Status', value: input.paymentStatus },
    { label: 'Stripe Payment', value: input.paymentId },
    { label: 'Fare Rule', value: input.fareRule },
    { label: 'Starting Fare', value: money(input.startingFare, input.currency) },
    { label: 'Distance Fare', value: money(input.baseAmount, input.currency) },
    { label: 'Discount', value: input.discountRate ? `${input.discountRate} (-${money(input.discountAmount, input.currency)})` : '-' },
    { label: 'Fare After Discount', value: money(input.fareAfterDiscount, input.currency) },
    { label: 'Night Surcharge', value: money(input.nightSurcharge, input.currency) },
    { label: 'Traffic Surcharge', value: money(input.trafficSurcharge, input.currency) },
    { label: 'Total Paid', value: money(input.totalAmount || input.amount, input.currency) },
  ]);

  return emailShell({
    eyebrow: 'Paid booking received',
    title: 'New Booking Confirmed',
    subtitle: `${input.name || 'Customer'} paid ${money(input.totalAmount || input.amount, input.currency)}`,
    sections: [
      { title: 'Trip Details', rows: tripRows },
      { title: 'Customer Details', rows: customerRows },
      { title: 'Payment Details', rows: paymentRows },
    ],
    footer: 'This booking was generated from Stripe Checkout.',
  });
}

export function buildBookingCustomerEmailHtml(input: BookingEmailInput) {
  const tripRows = rows([
    { label: 'Pickup', value: input.pickup },
    { label: 'Drop-off', value: input.dropoff },
    { label: 'Date / Time', value: `${input.date} ${input.time}`.trim() },
    { label: 'Passengers', value: input.passengers },
    { label: 'Vehicle', value: input.vehicle },
    { label: 'Vehicle Quantity', value: input.vehicleQuantity },
    { label: 'Special Requests', value: input.specialRequests },
  ]);

  const paymentRows = rows([
    { label: 'Payment Status', value: input.paymentStatus },
    { label: 'Fare Rule', value: input.fareRule },
    { label: 'Starting Fare', value: money(input.startingFare, input.currency) },
    { label: 'Distance Fare', value: money(input.baseAmount, input.currency) },
    { label: 'Discount', value: input.discountRate ? `${input.discountRate} (-${money(input.discountAmount, input.currency)})` : '-' },
    { label: 'Night Surcharge', value: money(input.nightSurcharge, input.currency) },
    { label: 'Traffic Surcharge', value: money(input.trafficSurcharge, input.currency) },
    { label: 'Total Paid', value: money(input.totalAmount || input.amount, input.currency) },
  ]);

  return emailShell({
    eyebrow: 'Booking confirmed',
    title: 'Thanks for your booking',
    subtitle: 'Your payment is confirmed. Our team will contact you shortly.',
    sections: [
      { title: 'Your Trip', rows: tripRows },
      { title: 'Payment Summary', rows: paymentRows },
    ],
    footer: 'Need help? Reply to this email or call Affordable Cabs Ltd.',
  });
}

function emailShell(input: {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: Array<{ title: string; rows: string }>;
  footer: string;
}) {
  const sections = input.sections
    .map(
      (section) => `
      <div style="background:#ffffff;border-radius:14px;margin-top:14px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="padding:14px 16px;background:linear-gradient(90deg,#facc15,#f59e0b);color:#111827;font-weight:900;">
          ${escapeHtml(section.title)}
        </div>
        <table style="width:100%;border-collapse:collapse;">
          ${section.rows}
        </table>
      </div>`,
    )
    .join('');

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
    <div style="max-width:680px;margin:0 auto;padding:24px;">
      <div style="background:#111827;color:#ffffff;border-radius:14px;padding:20px;">
        <div style="font-size:14px;opacity:0.9;">${escapeHtml(input.eyebrow)}</div>
        <div style="font-size:24px;font-weight:900;letter-spacing:0.2px;">${escapeHtml(input.title)}</div>
        <div style="font-size:14px;opacity:0.9;margin-top:8px;">${escapeHtml(input.subtitle)}</div>
      </div>
      ${sections}
      <div style="color:#6b7280;font-size:12px;margin-top:14px;line-height:1.5;">${escapeHtml(input.footer)}</div>
    </div>
  </body>
</html>`;
}

export function buildBookingEmailText(input: BookingEmailInput) {
  return [
    'Booking confirmed',
    '',
    `Pickup: ${input.pickup || '-'}`,
    `Drop-off: ${input.dropoff || '-'}`,
    `Date/Time: ${input.date || '-'} ${input.time || ''}`,
    `Passengers: ${input.passengers || '-'}`,
    `Vehicle: ${input.vehicle || '-'}`,
    `Vehicle quantity: ${input.vehicleQuantity || '-'}`,
    `Name: ${input.name || '-'}`,
    `Email: ${input.email || '-'}`,
    `Phone: ${input.phone || '-'}`,
    `Special requests: ${input.specialRequests || '-'}`,
    `Distance: ${input.distanceKm || '-'} km`,
    `Drive time: ${input.durationMinutes || '-'} min`,
    `Fare rule: ${input.fareRule || '-'}`,
    `Starting fare: ${money(input.startingFare, input.currency)}`,
    `Distance fare: ${money(input.baseAmount, input.currency)}`,
    `Discount: ${input.discountRate || '-'} ${input.discountAmount ? `(-${money(input.discountAmount, input.currency)})` : ''}`,
    `Night surcharge: ${money(input.nightSurcharge, input.currency)}`,
    `Traffic surcharge: ${money(input.trafficSurcharge, input.currency)}`,
    `Total paid: ${money(input.totalAmount || input.amount, input.currency)}`,
    `Payment status: ${input.paymentStatus}`,
    `Payment ID: ${input.paymentId}`,
  ].join('\n');
}
