import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DbService = Awaited<ReturnType<typeof prisma.service.findMany>>[number];
type ServiceDTO = Omit<DbService, "price"> & { price: number };

function toDTO(p: DbService): ServiceDTO {
  return { ...p, price: p.price };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const updated = await prisma.service.update({
    where: { id },
    data: {
      // Only update fields present
      ...(typeof body.name === "string" ? { name: body.name } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(typeof body.price === "number" ? { price: body.price } : {}),
      ...(body.cloudinary_public_id !== undefined ? { cloudinary_public_id: body.cloudinary_public_id } : {}),
    },
  });

  return NextResponse.json(toDTO(updated));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
