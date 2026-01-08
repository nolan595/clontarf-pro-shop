import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCheckout, getCheckoutByReference } from "@/lib/sumup";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

function roundMoney(amount: number) {
  return Math.round(amount * 100) / 100;
}

export async function POST(req: Request) {
  const body = await req.json();
  const voucherPurchaseId = body.voucherPurchaseId as string | undefined;

  if (!voucherPurchaseId) {
    return NextResponse.json(
      { error: "Missing voucherPurchaseId" },
      { status: 400 }
    );
  }

  const merchantCode =
    process.env.MERCHANT_CODE ||
    process.env.SUMUP_MERCHANT_CODE ||
    process.env.SUM_UP_MERCHANT_CODE;

  if (!merchantCode) {
    return NextResponse.json({ error: "Missing MERCHANT_CODE" }, { status: 500 });
  }

  const origin = process.env.APP_URL || new URL(req.url).origin;
  const returnUrl = `${origin}/vouchers?paid=1`;

  const reference = `voucher_${voucherPurchaseId}`;

  // --- 1) Transaction: load + reserve reference (race-safe) ---
  const purchase = await prisma.$transaction(async (tx) => {
    const p = await tx.voucherPurchase.findUnique({
      where: { id: voucherPurchaseId },
      select: {
        id: true,
        amount: true,
        currency: true,
        sumupCheckoutId: true,
        sumupReference: true,
      },
    });

    if (!p) return null;

    if (p.sumupCheckoutId) return p;

    // reserve the reference once (DB uniqueness prevents multiple writers)
    if (!p.sumupReference) {
      try {
        await tx.voucherPurchase.update({
          where: { id: voucherPurchaseId },
          data: { sumupReference: reference },
        });
      } catch (err) {
        // If another request reserved it first, we just continue
        // (Unique constraint violation can happen here)
      }
    }

    return { ...p, sumupReference: reference };
  });

  if (!purchase) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // already created: return it
  if (purchase.sumupCheckoutId) {
    return NextResponse.json({
      checkoutId: purchase.sumupCheckoutId,
      hostedUrl: null,
    });
  }

  // --- 2) Create SumUp checkout ---
  try {
    const created = await createCheckout({
      checkout_reference: reference,
      amount: roundMoney(purchase.amount), // amount already in euros
      currency: purchase.currency ?? "EUR",
      merchant_code: merchantCode,
      description: `Voucher purchase ${purchase.id}`,
      return_url: returnUrl,
    });

    // --- 3) Save checkoutId (idempotent update) ---
    const updated = await prisma.voucherPurchase.update({
      where: { id: purchase.id },
      data: { sumupCheckoutId: created.id },
      select: { sumupCheckoutId: true },
    });

    return NextResponse.json({
      checkoutId: updated.sumupCheckoutId,
      hostedUrl: created.hosted_checkout_url ?? null,
    });
  } catch (err: unknown) {
    // If SumUp says "duplicate checkout", another request likely created it.
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes("DUPLICATED_CHECKOUT")) {
      const latest = await prisma.voucherPurchase.findUnique({
        where: { id: purchase.id },
        select: { sumupCheckoutId: true },
      });

      if (latest?.sumupCheckoutId) {
        return NextResponse.json({
          checkoutId: latest.sumupCheckoutId,
          hostedUrl: null,
        });
      }

      try {
        const existing = await getCheckoutByReference(reference);

        if (existing?.id) {
          const updated = await prisma.voucherPurchase.update({
            where: { id: purchase.id },
            data: { sumupCheckoutId: existing.id },
            select: { sumupCheckoutId: true },
          });

          return NextResponse.json({
            checkoutId: updated.sumupCheckoutId,
            hostedUrl: existing.hosted_checkout_url ?? null,
          });
        }
      } catch (lookupErr) {
        console.error("SumUp lookup by reference failed:", lookupErr);
      }
    }

    console.error("SumUp create checkout failed:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
