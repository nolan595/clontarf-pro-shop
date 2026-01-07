import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DbPurchase = Awaited<
  ReturnType<typeof prisma.voucherPurchase.findMany>
>[number];

type VoucherPurchaseDTO = Omit<DbPurchase, "amount"> & { amount: number };

function toDTO(p: DbPurchase): VoucherPurchaseDTO {
  return { ...p, amount: p.amount.toNumber() };
}

export async function GET() {
  const purchases = await prisma.voucherPurchase.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(purchases.map(toDTO));
}

export async function POST(req: Request) {
  const body = await req.json();

  // Required fields from your JSON schema
  if (
    typeof body?.amount !== "number" ||
    !body?.buyer_name ||
    !body?.buyer_email
  ) {
    return NextResponse.json(
      { error: "amount (number), buyer_name, buyer_email are required" },
      { status: 400 }
    );
  }

  const created = await prisma.voucherPurchase.create({
    data: {
      amount: body.amount,
      buyer_name: body.buyer_name,
      buyer_email: body.buyer_email,
      recipient_name: body.recipient_name ?? null,
      recipient_email: body.recipient_email ?? null,
      message: body.message ?? null,
      status: body.status ?? "pending",
    },
  });

  return NextResponse.json(toDTO(created), { status: 201 });
}
