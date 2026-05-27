type InquiryTemplateInput = {
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

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export function buildInquiryEmailHtml(input: InquiryTemplateInput) {
  const source = input.source ? escapeHtml(input.source) : 'Website';
  const isBooking = input.source === 'Booking Form' || input.source === 'Booking Quote Form';
  const title = isBooking ? 'New Quote Request' : 'Quick Inquiry';
  const eyebrow = isBooking ? 'New quote request received' : 'New inquiry received';

  const customerLines: Array<{ label: string; value: string }> = [
    { label: 'Name', value: input.name || '-' },
    { label: 'Email', value: input.email || '-' },
    { label: 'Phone', value: input.phone || '-' },
  ];

  const tripLines: Array<{ label: string; value: string }> = [
    { label: 'Pickup', value: input.pickup || '-' },
    { label: 'Drop-off', value: input.dropoff || '-' },
    { label: 'Pickup Date', value: input.date || '-' },
    { label: 'Pickup Time', value: input.pickupTime || '-' },
    { label: 'Drop-off Time', value: input.dropTime || '-' },
    { label: 'Total Distance', value: input.distance || '-' },
    { label: 'Drive Time', value: input.driveTime || '-' },
    { label: 'Passengers', value: input.passengers || '-' },
    { label: 'Vehicle Type', value: input.vehicleType || '-' },
    { label: 'Calculated Total', value: input.estimatedTotal || '-' },
    { label: 'Fare Rule', value: input.fareRule || '-' },
    { label: 'Coupon', value: input.couponCode || '-' },
    { label: 'Starting Fare', value: input.startingFare || '-' },
    { label: 'Distance Fare', value: input.distanceFare || '-' },
    { label: 'Discount', value: input.discount || '-' },
    { label: 'Night Surcharge', value: input.nightSurcharge || '-' },
    { label: 'Traffic Surcharge', value: input.trafficSurcharge || '-' },
    { label: 'Special Requests', value: input.specialRequests || '-' },
  ];

  const inquiryLines: Array<{ label: string; value: string }> = [
    ...customerLines,
    { label: 'Pickup', value: input.pickup || '-' },
    { label: 'Drop-off', value: input.dropoff || '-' },
    { label: 'Pickup Time', value: input.pickupTime || '-' },
    { label: 'Drop-off Time', value: input.dropTime || '-' },
    { label: 'Message', value: input.message || '-' },
  ];

  const rows = (lines: Array<{ label: string; value: string }>) =>
    lines
    .map(
      (l) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:700;width:140px;vertical-align:top;">${escapeHtml(
            l.label,
          )}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#374151;vertical-align:top;">${escapeHtml(
            l.value,
          ).replaceAll('\n', '<br>')}</td>
        </tr>`,
    )
    .join('');

  const customerRows = rows(customerLines);
  const tripRows = rows(tripLines);
  const inquiryRows = rows(inquiryLines);

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <div style="background:#111827;color:#ffffff;border-radius:14px;padding:18px 20px;">
        <div style="font-size:14px;opacity:0.9;">${eyebrow}</div>
        <div style="font-size:22px;font-weight:900;letter-spacing:0.3px;">${title}</div>
        <div style="font-size:12px;opacity:0.8;margin-top:6px;">Source: ${source}</div>
      </div>

      <div style="background:#ffffff;border-radius:14px;margin-top:14px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="padding:14px 16px;background:linear-gradient(90deg,#facc15,#f59e0b);color:#111827;font-weight:900;">
          ${isBooking ? 'Trip Details' : 'Customer Details'}
        </div>
        <table style="width:100%;border-collapse:collapse;">
          ${isBooking ? tripRows : inquiryRows}
        </table>
      </div>

      ${
        isBooking
          ? `<div style="background:#ffffff;border-radius:14px;margin-top:14px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="padding:14px 16px;background:#111827;color:#ffffff;font-weight:900;">
          Customer Details
        </div>
        <table style="width:100%;border-collapse:collapse;">
          ${customerRows}
        </table>
      </div>`
          : ''
      }

      <div style="color:#6b7280;font-size:12px;margin-top:14px;line-height:1.4;">
        Reply directly to this email to respond to the customer.
      </div>
    </div>
  </body>
</html>`;
}
