type InquiryTemplateInput = {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  dropoff: string;
  message: string;
  source?: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export function buildInquiryEmailHtml(input: InquiryTemplateInput) {
  const lines: Array<{ label: string; value: string }> = [
    { label: 'Name', value: input.name || '-' },
    { label: 'Email', value: input.email || '-' },
    { label: 'Phone', value: input.phone || '-' },
    { label: 'Pickup', value: input.pickup || '-' },
    { label: 'Drop-off', value: input.dropoff || '-' },
    { label: 'Message', value: input.message || '-' },
  ];

  const rows = lines
    .map(
      (l) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:700;width:140px;vertical-align:top;">${escapeHtml(
            l.label,
          )}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#374151;vertical-align:top;">${escapeHtml(
            l.value,
          )}</td>
        </tr>`,
    )
    .join('');

  const source = input.source ? escapeHtml(input.source) : 'Website';

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <div style="background:#111827;color:#ffffff;border-radius:14px;padding:18px 20px;">
        <div style="font-size:14px;opacity:0.9;">New inquiry received</div>
        <div style="font-size:22px;font-weight:900;letter-spacing:0.3px;">Quick Inquiry</div>
        <div style="font-size:12px;opacity:0.8;margin-top:6px;">Source: ${source}</div>
      </div>

      <div style="background:#ffffff;border-radius:14px;margin-top:14px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="padding:14px 16px;background:linear-gradient(90deg,#facc15,#f59e0b);color:#111827;font-weight:900;">
          Customer Details
        </div>
        <table style="width:100%;border-collapse:collapse;">
          ${rows}
        </table>
      </div>

      <div style="color:#6b7280;font-size:12px;margin-top:14px;line-height:1.4;">
        Reply directly to this email to respond to the customer.
      </div>
    </div>
  </body>
</html>`;
}

