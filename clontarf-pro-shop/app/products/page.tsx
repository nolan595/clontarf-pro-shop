import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";
import { unstable_cache } from "next/cache";

export const runtime = "nodejs";
export const revalidate = 60;

const getProducts = unstable_cache(
  async () => {
    return prisma.product.findMany({
      orderBy: [{ is_featured: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        cloudinary_public_id: true,
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
    price: p.price
  }));

  return <ProductsClient products={safeProducts} />;
}
