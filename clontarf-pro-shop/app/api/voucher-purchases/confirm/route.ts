import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCheckout } from "@/lib/sumup";
import { sendEmail } from "@/lib/email";
import { voucherPdfBase64 } from "@/lib/voucherPdf";

export const runtime = "nodejs"; // important for server-side PDF generation

function uniq(emails: (string | null)[]) {
  return emails.filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i) as string[];
}

function sameEmail(a?: string | null, b?: string | null) {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function maskEmail(email: string) {
  const [u, d] = email.split("@");
  if (!d) return email;
  const safeU = u.length <= 2 ? `${u[0] ?? "*"}*` : `${u.slice(0, 2)}***`;
  return `${safeU}@${d}`;
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
      <p style="margin:0 0 12px 0">Hi ${escapeHtml(name)},</p>
      <p style="margin:0 0 12px 0">Your voucher PDF is attached.</p>
      <div style="margin:12px 0;padding:12px;border:1px solid #e5e7eb;border-radius:10px;background:#fafafa">
        <div><strong>Amount:</strong> €${amount.toFixed(2)}</div>
        <div><strong>Voucher code:</strong> <code>${escapeHtml(voucherCode)}</code></div>
      </div>
      <p style="margin:0">Redeemable for lessons, equipment, or pro shop merchandise.</p>
    </div>
  `;
}

function buildBuyerConfirmHtml({
  buyerName,
  amount,
  recipientName,
  recipientEmail,
}: {
  buyerName: string;
  amount: number;
  recipientName: string;
  recipientEmail: string;
}) {
  return `
    <div style="font-family:System-UI,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 12px 0">Voucher sent ✅</h2>
      <p style="margin:0 0 12px 0">Hi ${escapeHtml(buyerName)},</p>
      <p style="margin:0 0 12px 0">
        Your golf voucher for <strong>€${amount.toFixed(2)}</strong> has been sent to
        <strong>${escapeHtml(recipientName)}</strong> (${escapeHtml(maskEmail(recipientEmail))}).
      </p>
      <p style="margin:0">
        If they don’t see it within a few minutes, ask them to check spam/junk.
      </p>
    </div>
  `;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function isPaidStatus(status: string) {
  const s = status.toUpperCase();
  return s === "PAID" || s === "SUCCESSFUL" || s === "CAPTURED";
}

export async function POST(req: Request) {
  const { checkoutId } = await req.json();
  if (!checkoutId) return NextResponse.json({ error: "Missing checkoutId" }, { status: 400 });

  const purchase = await prisma.voucherPurchase.findFirst({
    where: { sumupCheckoutId: checkoutId },
  });
  if (!purchase) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });

  const checkout = await getCheckout(checkoutId);

  // Not paid yet => bail
  if (!isPaidStatus(checkout.status)) {
    return NextResponse.json({ ok: true, status: "PENDING" });
  }

  // Ensure paid in DB (idempotent)
  const paidPurchase =
    purchase.status === "PAID" && purchase.paidAt
      ? purchase
      : await prisma.voucherPurchase.update({
          where: { id: purchase.id },
          data: { status: "PAID", paidAt: new Date() },
        });

  // Email idempotency
  if (paidPurchase.emailedAt) {
    return NextResponse.json({ ok: true, status: "PAID", emailed: true });
  }

  // Basic email sanity
  const buyerEmail = paidPurchase.buyer_email;
  const recipientEmail = paidPurchase.recipient_email;

  if (!buyerEmail && !recipientEmail) {
    return NextResponse.json({ error: "No email address on purchase" }, { status: 400 });
  }

  const recipientIsDifferent =
    !!recipientEmail && !!buyerEmail && !sameEmail(recipientEmail, buyerEmail);

  // Option B: voucher PDF to both if gifting; otherwise just to whichever exists
  const voucherRecipients = recipientIsDifferent
    ? uniq([buyerEmail, recipientEmail])
    : uniq([buyerEmail, recipientEmail]);

  const voucherCode = paidPurchase.id.substring(0, 8).toUpperCase();

  // Generate PDF ONCE (base64) using the same layout as admin
  const pdfBase64 = voucherPdfBase64({
    id: paidPurchase.id,
    amount: Number(paidPurchase.amount),
    recipient_name: paidPurchase.recipient_name,
    message: paidPurchase.message,
  });

  // Send voucher email (PDF attached) to voucherRecipients
  await Promise.all(
    voucherRecipients.map((to) =>
      sendEmail({
        to,
        subject: "Your Golf Voucher 🎁 (PDF attached)",
        html: buildVoucherHtml({
          name: to === recipientEmail ? paidPurchase.recipient_name ?? "there" : paidPurchase.buyer_name ?? "there",
          amount: Number(paidPurchase.amount),
          voucherCode,
        }),
        attachments: [
          {
            filename: `voucher-${paidPurchase.id}.pdf`,
            contentBase64: pdfBase64,
          },
        ],
      }),
    ),
  );

  // Buyer confirmation email (only when sent to someone else)
  if (recipientIsDifferent && buyerEmail) {
    await sendEmail({
      to: buyerEmail,
      subject: "Voucher sent ✅",
      html: buildBuyerConfirmHtml({
        buyerName: paidPurchase.buyer_name ?? "there",
        amount: Number(paidPurchase.amount),
        recipientName: paidPurchase.recipient_name ?? "your recipient",
        recipientEmail: recipientEmail!,
      }),
    });
  }

  // Mark emailed AFTER success
  await prisma.voucherPurchase.update({
    where: { id: paidPurchase.id },
    data: { emailedAt: new Date() },
  });

  return NextResponse.json({ ok: true, status: "PAID", emailed: true });
}
