import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type CreateVoucherPurchaseBody = {
  amount: number;
  buyer_name: string;
  buyer_email: string;
  recipient_name?: string | null;
  recipient_email?: string | null;
  message?: string | null;
};

export async function GET() {
  const purchases = await prisma.voucherPurchase.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      amount: true,
      buyer_name: true,
      buyer_email: true,
      recipient_name: true,
      recipient_email: true,
      message: true,
      status: true,
      sumupCheckoutId: true,
      paidAt: true,
      emailedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const safe = purchases.map((p) => ({
    ...p,
    paidAt: p.paidAt ? p.paidAt.toISOString() : null,
    emailedAt: p.emailedAt ? p.emailedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return NextResponse.json(safe);
}

export async function POST(req: Request) {
  const body: CreateVoucherPurchaseBody = await req.json();

  if (
    typeof body.amount !== "number" ||
    !Number.isFinite(body.amount) ||
    body.amount <= 0
  ) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (!body.buyer_name || typeof body.buyer_name !== "string") {
    return NextResponse.json({ error: "buyer_name is required" }, { status: 400 });
  }

  if (!body.buyer_email || typeof body.buyer_email !== "string") {
    return NextResponse.json({ error: "buyer_email is required" }, { status: 400 });
  }

  // avoid float weirdness like 19.999999
  const amount = Math.round(body.amount * 100) / 100;

  try {
    const created = await prisma.voucherPurchase.create({
      data: {
        amount,
        buyer_name: body.buyer_name.trim(),
        buyer_email: body.buyer_email.trim(),
        recipient_name: body.recipient_name?.trim() ?? null,
        recipient_email: body.recipient_email?.trim() ?? null,
        message: body.message ?? null,
        status: "PENDING",
      },
      select: {
        id: true,
        amount: true,
        buyer_name: true,
        buyer_email: true,
        recipient_name: true,
        recipient_email: true,
        message: true,
        status: true,
        sumupCheckoutId: true,
        paidAt: true,
        emailedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ...created,
      paidAt: created.paidAt ? created.paidAt.toISOString() : null,
      emailedAt: created.emailedAt ? created.emailedAt.toISOString() : null,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error("POST /api/voucher-purchases failed:", err);
    return NextResponse.json(
      { error: "Failed to create voucher purchase" },
      { status: 500 }
    );
  }
}
