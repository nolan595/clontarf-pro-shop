import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedStatuses = ["pending", "paid", "sent", "cancelled"] as const;
type Status = (typeof allowedStatuses)[number];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const status = body?.status as Status;

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  const updated = await prisma.voucherPurchase.update({
    where: { id: params.id },
    data: { status },
    select: { id: true, status: true },
  });

  return NextResponse.json(updated);
}
