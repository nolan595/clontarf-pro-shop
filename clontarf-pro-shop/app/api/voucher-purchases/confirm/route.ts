import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCheckout } from "@/lib/sumup";

function isPaidStatus(status: string) {
  const s = status.toUpperCase();
  // SumUp status values can vary; we accept common “paid” states
  return s === "PAID" || s === "SUCCESSFUL" || s === "CAPTURED";
}

export async function POST(req: Request) {
  const { checkoutId } = await req.json();

  if (!checkoutId) return NextResponse.json({ error: "Missing checkoutId" }, { status: 400 });

  const purchase = await prisma.voucherPurchase.findFirst({
    where: { sumupCheckoutId: checkoutId },
  });

  if (!purchase) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });

  // already paid => idempotent
  if (purchase.status === "PAID" && purchase.paidAt) {
    return NextResponse.json({ ok: true, status: "PAID" });
  }

  const checkout = await getCheckout(checkoutId);

  if (isPaidStatus(checkout.status)) {
    await prisma.voucherPurchase.update({
      where: { id: purchase.id },
      data: { status: "PAID", paidAt: new Date() },
    });

    // TODO: email voucher idempotently (emailedAt == null)
    // if (!purchase.emailedAt) { sendEmail(); set emailedAt }

    return NextResponse.json({ ok: true, status: "PAID" });
  }

  return NextResponse.json({ ok: true, status: "PENDING" });
}
