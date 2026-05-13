import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function notifyPendingReview(
  incidentId: string,
  violationType: string,
  address: string,
): Promise<void> {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) return;

  const adminUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/admin`;

  await resend.emails.send({
    from: 'PoliceWatch <noreply@policewatch.app>',
    to: process.env.ADMIN_EMAIL,
    subject: `[PoliceWatch] Incident pending review — ${violationType}`,
    html: `
      <h2>New incident requires human review</h2>
      <p><strong>Violation:</strong> ${violationType}</p>
      <p><strong>Location:</strong> ${address}</p>
      <p><strong>Incident ID:</strong> ${incidentId}</p>
      <p>AI could not confirm the violation with high confidence.</p>
      <p><a href="${adminUrl}">Review in admin panel →</a></p>
    `,
  });
}
