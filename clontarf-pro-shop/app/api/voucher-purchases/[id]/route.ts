import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";


export const runtime = "nodejs";

type UpdateVoucherPurchaseBody = {
  amount?: number;
  buyer_name?: string;
  buyer_email?: string;
  recipient_name?: string | null;
  recipient_email?: string | null;
  message?: string | null;
  status?: "PENDING" | "PAID" | "FAILED";
};

function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const purchase = await prisma.voucherPurchase.findUnique({
    where: { id },
  });

  if (!purchase) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...purchase,
    paidAt: purchase.paidAt ? purchase.paidAt.toISOString() : null,
    emailedAt: purchase.emailedAt ? purchase.emailedAt.toISOString() : null,
    createdAt: purchase.createdAt.toISOString(),
    updatedAt: purchase.updatedAt.toISOString(),
  });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body: UpdateVoucherPurchaseBody = await req.json();

const data: Prisma.VoucherPurchaseUpdateInput = {};
  // Amount (Float)
  if (typeof body.amount === "number" && Number.isFinite(body.amount)) {
    if (body.amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    data.amount = roundMoney(body.amount);
  }

  if (typeof body.buyer_name === "string") data.buyer_name = body.buyer_name.trim();
  if (typeof body.buyer_email === "string") data.buyer_email = body.buyer_email.trim();

  if (body.recipient_name === null || typeof body.recipient_name === "string") {
    data.recipient_name = body.recipient_name ? body.recipient_name.trim() : null;
  }

  if (body.recipient_email === null || typeof body.recipient_email === "string") {
    data.recipient_email = body.recipient_email ? body.recipient_email.trim() : null;
  }

  if (body.message === null || typeof body.message === "string") {
    data.message = body.message;
  }

  if (body.status && ["PENDING", "PAID", "FAILED"].includes(body.status)) {
    data.status = body.status;

    // helpful automatic timestamps
    if (body.status === "PAID") data.paidAt = data.paidAt ?? new Date();
    if (body.status !== "PAID") data.paidAt = null;
  }

  try {
    const updated = await prisma.voucherPurchase.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      ...updated,
      paidAt: updated.paidAt ? updated.paidAt.toISOString() : null,
      emailedAt: updated.emailedAt ? updated.emailedAt.toISOString() : null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error("PATCH /api/voucher-purchases/[id] failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.voucherPurchase.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/voucher-purchases/[id] failed:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
