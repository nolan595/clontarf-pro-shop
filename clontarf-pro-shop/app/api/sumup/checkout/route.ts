import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCheckout } from "@/lib/sumup";

function centsToAmount(cents: number) {
  return Math.round(cents) / 100;
}

export async function POST(req: Request) {
  const body = await req.json();
  const voucherPurchaseId = body.voucherPurchaseId as string | undefined;

  if (!voucherPurchaseId) {
    return NextResponse.json({ error: "Missing voucherPurchaseId" }, { status: 400 });
  }

  const purchase = await prisma.voucherPurchase.findUnique({
    where: { id: voucherPurchaseId },
  });

  if (!purchase) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If already has checkout, return it (idempotent)
  if (purchase.sumupCheckoutId) {
    return NextResponse.json({ checkoutId: purchase.sumupCheckoutId });
  }

  const merchantCode =
    process.env.MERCHANT_CODE ||
    process.env.SUMUP_MERCHANT_CODE ||
    process.env.SUM_UP_MERCHANT_CODE;

  if (!merchantCode) {
    return NextResponse.json({ error: "Missing MERCHANT_CODE" }, { status: 500 });
  }

  const origin = process.env.APP_URL || new URL(req.url).origin;

  // return_url is optional for widget-only, but useful for hosted fallback
  const returnUrl = `${origin}/vouchers?paid=1`;

  const reference = `voucher_${purchase.id}`;

  const created = await createCheckout({
    checkout_reference: reference,
    amount: centsToAmount(purchase.amount),
    currency: purchase.currency,
    merchant_code: merchantCode,
    description: `Voucher purchase ${purchase.id}`,
    return_url: returnUrl,
  });

  await prisma.voucherPurchase.update({
    where: { id: purchase.id },
    data: { sumupCheckoutId: created.id },
  });

  return NextResponse.json({
    checkoutId: created.id,
    hostedUrl: created.hosted_checkout_url ?? null,
  });
}
