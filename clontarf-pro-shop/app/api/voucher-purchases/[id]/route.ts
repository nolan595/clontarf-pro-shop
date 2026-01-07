import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: Context) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing voucher purchase id" },
      { status: 400 }
    );
  }

  const body: Partial<{
    amount: number;
    buyer_name: string;
    buyer_email: string;
    recipient_name: string | null;
    recipient_email: string | null;
    message: string | null;
  }> = await req.json();

  const data: Prisma.VoucherPurchaseUpdateInput = {};

  // Amount (Decimal)
  if (typeof body.amount === "number" && Number.isFinite(body.amount)) {
    data.amount = new Prisma.Decimal(body.amount);
  }

  if (typeof body.buyer_name === "string") {
    data.buyer_name = body.buyer_name;
  }

  if (typeof body.buyer_email === "string") {
    data.buyer_email = body.buyer_email;
  }

  if (typeof body.recipient_name === "string" || body.recipient_name === null) {
    data.recipient_name = body.recipient_name;
  }

  if (
    typeof body.recipient_email === "string" ||
    body.recipient_email === null
  ) {
    data.recipient_email = body.recipient_email;
  }

  if (typeof body.message === "string" || body.message === null) {
    data.message = body.message;
  }

  try {
    const updated = await prisma.voucherPurchase.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      ...updated,
      amount: updated.amount.toNumber(),
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Voucher purchase not found" },
        { status: 404 }
      );
    }

    console.error("PATCH /api/voucher-purchases/[id] failed:", err);
    return NextResponse.json(
      { error: "Failed to update voucher purchase" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, context: Context) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing voucher purchase id" },
      { status: 400 }
    );
  }

  try {
    await prisma.voucherPurchase.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Voucher purchase not found" },
        { status: 404 }
      );
    }

    console.error("DELETE /api/voucher-purchases/[id] failed:", err);
    return NextResponse.json(
      { error: "Failed to delete voucher purchase" },
      { status: 500 }
    );
  }
}
