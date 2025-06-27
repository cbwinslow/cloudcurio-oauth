export async function sendEmail(to: string, subject: string, body: string) {
  // Plug in your email provider here (e.g. SendGrid, Resend, Mailgun)
  // This is only a placeholder for demonstration.
  console.log(`Sending email to ${to}: ${subject}\n${body}`);
}