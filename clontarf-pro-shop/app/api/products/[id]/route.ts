import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DbProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number];
type ProductDTO = Omit<DbProduct, "price"> & { price: number };

function toDTO(p: DbProduct): ProductDTO {
  return { ...p, price: p.price.toNumber() };
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: {
      // Only update fields present
      ...(typeof body.name === "string" ? { name: body.name } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(typeof body.price === "number" ? { price: body.price } : {}),
      ...(body.image_url !== undefined ? { image_url: body.image_url } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.brand !== undefined ? { brand: body.brand } : {}),
      ...(typeof body.is_featured === "boolean" ? { is_featured: body.is_featured } : {}),
      ...(typeof body.in_stock === "boolean" ? { in_stock: body.in_stock } : {}),
    },
  });

  return NextResponse.json(toDTO(updated));
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
