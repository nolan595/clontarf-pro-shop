import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { voucherPdfBase64 } from "@/lib/voucherPdf";

export const runtime = "nodejs";

function uniq(emails: (string | null | undefined)[]) {
  return emails
    .filter(Boolean)
    .map((e) => e!.trim())
    .filter((v, i, arr) => arr.indexOf(v) === i);
}

function sameEmail(a?: string | null, b?: string | null) {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function buildVoucherHtml({
  name,
  amount,
  voucherCode,
}: {
  name: string;
  amount: number;
  voucherCode: string;
}) {
  return `
    <div style="font-family:System-UI,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 12px 0">Your Golf Voucher 🎁</h2>
      <p style="margin:0 0 12px 0">Hi ${name},</p>
      <p style="margin:0 0 12px 0">Your voucher PDF is attached.</p>
      <div style="margin:12px 0;padding:12px;border:1px solid #e5e7eb;border-radius:10px;background:#fafafa">
        <div><strong>Amount:</strong> €${amount.toFixed(2)}</div>
        <div><strong>Voucher code:</strong> <code>${voucherCode}</code></div>
      </div>
      <p style="margin:0">Redeemable for lessons, equipment, or pro shop merchandise.</p>
    </div>
  `;
}

export async function POST(req: Request) {
  // You can POST a JSON body, but we also provide defaults so you can curl -X POST with no body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const buyerEmail = (body.buyerEmail as string | undefined) ?? "markjnolan00@gmail.com";
  const recipientEmail = (body.recipientEmail as string | undefined) ?? "mark.nolan@happening.xyz"; // same by default

  const buyerName = (body.buyerName as string | undefined) ?? "Mark";
  const recipientName = (body.recipientName as string | undefined) ?? "Mark";
  const amount = Number(body.amount ?? 50);

  // Fake purchase id just for testing voucher code + filename
  const fakeId = (body.fakeId as string | undefined) ?? "cmk64a0v8000aylv6mfwjxxm2";
  const voucherCode = fakeId.substring(0, 8).toUpperCase();

  // This is your production “Option B” dedupe behavior
  const recipientIsDifferent = !sameEmail(buyerEmail, recipientEmail);

  const voucherRecipients = recipientIsDifferent
    ? uniq([buyerEmail, recipientEmail])
    : uniq([buyerEmail, recipientEmail]); // same array, uniq does the work

  // Generate the PDF ONCE (same layout as admin)
  const pdfBase64 = voucherPdfBase64({
    id: fakeId,
    amount,
    recipient_name: recipientName,
    message: body.message ?? "This is a test voucher message.",
  });

  // Send voucher email + attachment to all voucherRecipients
  await Promise.all(
    voucherRecipients.map((to) =>
      sendEmail({
        to,
        subject: "TEST: Your Golf Voucher 🎁 (PDF attached)",
        html: buildVoucherHtml({
          name: to === recipientEmail ? recipientName : buyerName,
          amount,
          voucherCode,
        }),
        attachments: [
          {
            filename: `voucher-${fakeId}.pdf`,
            contentBase64: pdfBase64,
          },
        ],
      }),
    ),
  );

  return NextResponse.json({
    ok: true,
    buyerEmail,
    recipientEmail,
    voucherRecipients,
    dedupedCount: voucherRecipients.length,
  });
}
