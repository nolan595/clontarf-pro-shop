import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      amount: true,
      buyer_name: true,
      buyer_email: true,
      recipient_name: true,
      recipient_email: true,
      message: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const safe = purchases.map((p) => ({
    ...p,
    amount: p.amount.toNumber(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return NextResponse.json(safe);
}

export async function POST(req: Request) {
  const body: CreateVoucherPurchaseBody = await req.json();

  // Basic validation
  if (typeof body.amount !== "number" || !Number.isFinite(body.amount) || body.amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (!body.buyer_name || typeof body.buyer_name !== "string") {
    return NextResponse.json({ error: "buyer_name is required" }, { status: 400 });
  }

  if (!body.buyer_email || typeof body.buyer_email !== "string") {
    return NextResponse.json({ error: "buyer_email is required" }, { status: 400 });
  }

  try {
    const created = await prisma.voucherPurchase.create({
      data: {
        amount: new Prisma.Decimal(body.amount),
        buyer_name: body.buyer_name,
        buyer_email: body.buyer_email,
        recipient_name: body.recipient_name ?? null,
        recipient_email: body.recipient_email ?? null,
        message: body.message ?? null,
      },
      select: {
        id: true,
        amount: true,
        buyer_name: true,
        buyer_email: true,
        recipient_name: true,
        recipient_email: true,
        message: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ...created,
      amount: created.amount.toNumber(),
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error("POST /api/voucher-purchases failed:", err);
    return NextResponse.json({ error: "Failed to create voucher purchase" }, { status: 500 });
  }
}
