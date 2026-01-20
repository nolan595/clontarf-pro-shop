import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

type DbProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number];
type ProductDTO = Omit<DbProduct, "price"> & { price: number };

function toDTO(p: DbProduct): ProductDTO {
  return { ...p, price: p.price };
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: [{ is_featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(products.map(toDTO));
}

export async function POST(req: NextRequest) {
  const body: Partial<{
    name: string;
    description: string | null;
    price: number;
    cloudinary_public_id: string;
    category: "clubs" | "balls" | "apparel" | "accessories" | "shoes" | "bags" | null;
    brand: string | null;
    is_featured: boolean;
    in_stock: boolean;
  }> = await req.json();

  if (!body.name || typeof body.price !== "number") {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  try {
    const created = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description ?? null,
        price: body.price,
        cloudinary_public_id: body.cloudinary_public_id,
        category: body.category ?? null,
        brand: body.brand ?? null,
        is_featured: Boolean(body.is_featured),
        in_stock: body.in_stock !== undefined ? Boolean(body.in_stock) : true,
      },
    });

    return NextResponse.json(toDTO(created));
  } catch (err) {
    console.error("POST /api/products failed:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
