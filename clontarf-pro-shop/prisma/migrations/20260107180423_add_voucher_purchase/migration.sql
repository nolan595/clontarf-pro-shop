-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('clubs', 'balls', 'apparel', 'accessories', 'shoes', 'bags');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "image_url" TEXT,
    "category" "ProductCategory",
    "brand" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "in_stock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoucherPurchase" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "buyer_name" TEXT NOT NULL,
    "buyer_email" TEXT NOT NULL,
    "recipient_name" TEXT,
    "recipient_email" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoucherPurchase_pkey" PRIMARY KEY ("id")
);
