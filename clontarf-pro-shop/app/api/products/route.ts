import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DbProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number];
type ProductDTO = Omit<DbProduct, "price"> & { price: number };

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: [{ is_featured: "desc" }, { createdAt: "desc" }],
  });

  const safe: ProductDTO[] = products.map((p) => ({
    ...p,
    price: p.price.toNumber(),
  }));

  return NextResponse.json(safe);
}
