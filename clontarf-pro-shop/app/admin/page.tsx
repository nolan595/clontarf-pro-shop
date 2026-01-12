import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [products, purchases] = await Promise.all([
    prisma.product.findMany({
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
    }),
    prisma.voucherPurchase.findMany({
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        amount: true,
        buyer_name: true,
        buyer_email: true,
        recipient_name: true,
        recipient_email: true,
        message: true,
        createdAt: true,
      },
    }),
  ]);

  const safeProducts = products.map((p) => ({
    ...p,
    price: p.price
  }));

  // amount might be Int or Decimal depending on your schema
  const safePurchases = purchases.map((p) => ({
    ...p,
    amount: typeof p.amount === "number" ? p.amount : Number(p.amount),
    createdAt: p.createdAt.toISOString(),
  }));

  return <AdminClient products={safeProducts} purchases={safePurchases} />;
}
