import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { ProductCategory } from "@prisma/client";

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.voucherPurchase.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Titleist Pro V1 (Dozen)",
        description: "Premium tour golf balls with exceptional distance and control.",
        price: 59.99,
        image_url:
          "https://source.unsplash.com/800x800/?golf",
        category: ProductCategory.balls,
        brand: "Titleist",
        is_featured: true,
        in_stock: true,
      },
      {
        name: "TaylorMade Stealth 2 Driver",
        description: "High forgiveness driver with explosive ball speed.",
        price: 549.0,
        image_url:
          "https://source.unsplash.com/800x800/?golf",
        category: ProductCategory.clubs,
        brand: "TaylorMade",
        is_featured: true,
        in_stock: true,
      },
      {
        name: "FootJoy StaSof Glove",
        description: "Soft premium leather glove for superior feel.",
        price: 29.99,
        image_url:
          "https://source.unsplash.com/800x800/?golf",
        category: ProductCategory.accessories,
        brand: "FootJoy",
        is_featured: false,
        in_stock: true,
      },
    ],
  });

  await prisma.voucherPurchase.createMany({
    data: [
      {
        amount: 50,
        buyer_name: "Mark Nolan",
        buyer_email: "mark@example.com",
        recipient_name: "Eoin O'Brien",
        recipient_email: "eoin@example.com",
        message: "Happy birthday! Enjoy a lesson.",
      },
      {
        amount: 100,
        buyer_name: "Sarah Murphy",
        buyer_email: "sarah@example.com",
        recipient_name: "John Murphy",
        recipient_email: "john@example.com",
        message: "Golf lessons incoming. No excuses now 😄",
      },
      {
        amount: 75,
        buyer_name: "Aoife Byrne",
        buyer_email: "aoife@example.com",
        recipient_name: "Dad",
        recipient_email: "dad@example.com",
        message: "For the best round of your life (or at least fewer slices).",
      },
    ],
  });

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
