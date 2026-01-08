import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ is_featured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image_url: true,
      category: true,
      brand: true,
      is_featured: true,
      in_stock: true,
    },
  });

  const safeProducts = products.map((p) => ({
    ...p,
    price: p.price.toNumber(),
  }));

  return <ProductsClient products={safeProducts} />;
}
