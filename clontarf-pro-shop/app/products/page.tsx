import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";
import { unstable_cache } from "next/cache";

export const runtime = "nodejs";
export const revalidate = 60; // cache the page/data for 60s

const getProducts = unstable_cache(
  async () => {
    return prisma.product.findMany({
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
  },
  ["products:list"],
  { revalidate: 60 }
);

export default async function ProductsPage() {
  const products = await getProducts();

  const safeProducts = products.map((p) => ({
    ...p,
    price: p.price.toNumber(),
  }));

  return <ProductsClient products={safeProducts} />;
}
