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
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  const body: Partial<{
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    category: "clubs" | "balls" | "apparel" | "accessories" | "shoes" | "bags" | null;
    brand: string | null;
    is_featured: boolean;
    in_stock: boolean;
  }> = await req.json();

  // Build update data safely (only fields provided)
  const data: Prisma.ProductUpdateInput = {};

  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.description === "string" || body.description === null) data.description = body.description;
  if (typeof body.image_url === "string" || body.image_url === null) data.image_url = body.image_url;
  if (typeof body.brand === "string" || body.brand === null) data.brand = body.brand;
  if (typeof body.is_featured === "boolean") data.is_featured = body.is_featured;
  if (typeof body.in_stock === "boolean") data.in_stock = body.in_stock;

  if (
    body.category === null ||
    body.category === "clubs" ||
    body.category === "balls" ||
    body.category === "apparel" ||
    body.category === "accessories" ||
    body.category === "shoes" ||
    body.category === "bags"
  ) {
    data.category = body.category;
  }

  // Price: Prisma Decimal expects a Decimal-ish value.
  if (typeof body.price === "number" && Number.isFinite(body.price)) {
    data.price = new Prisma.Decimal(body.price);
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      ...updated,
      price: updated.price.toNumber(),
    });
  } catch (err) {
    // Common case: not found
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.error("PATCH /api/products/[id] failed:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

type DeleteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_req: Request, context: DeleteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.error("DELETE /api/products/[id] failed:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
