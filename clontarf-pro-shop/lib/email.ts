type EmailAttachment = {
  filename: string;
  contentBase64: string; // base64 of the PDF bytes
};

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_FROM_EMAIL,
        name: process.env.BREVO_FROM_NAME,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,

      attachment: attachments?.length
        ? attachments.map((a) => ({
            name: a.filename,
            content: a.contentBase64,
          }))
        : undefined,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Brevo error: ${error}`);
  }

  return res.json();
}
