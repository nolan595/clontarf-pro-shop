"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Filter } from "lucide-react";
import Select from "@/components/ui/Select";
import { CldImage } from "next-cloudinary";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cloudinary_public_id: string | null;
  category:
    | "clubs"
    | "balls"
    | "apparel"
    | "accessories"
    | "shoes"
    | "bags"
    | null;
  brand: string | null;
  is_featured: boolean;
  in_stock: boolean;
};

const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "clubs", label: "Clubs" },
  { value: "balls", label: "Balls" },
  { value: "apparel", label: "Apparel" },
  { value: "accessories", label: "Accessories" },
  { value: "shoes", label: "Shoes" },
  { value: "bags", label: "Bags" },
] as const;

export default function ProductsClient({ products }: { products: Product[] }) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    if (categoryFilter === "all") return products;
    return products.filter((p) => p.category === categoryFilter);
  }, [products, categoryFilter]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-golf.jpeg"
            alt="Golf products"
            fill
            priority={false}
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-[var(--accent-green)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Our Products
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Premium golf equipment and apparel from the world&apos;s leading brands
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Filter className="w-5 h-5 text-[var(--text-secondary)]" />

            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={CATEGORIES as unknown as { value: string; label: string }[]}
              className="w-48"
            />

            <span className="text-sm text-[var(--text-secondary)]">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </motion.div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-[var(--text-secondary)]">No products available yet</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="
                    rounded-2xl overflow-hidden
                    border border-[var(--border)] bg-[var(--surface)]
                    shadow-[0_16px_50px_rgba(0,0,0,0.35)]
                    hover:shadow-[0_26px_70px_rgba(0,0,0,0.45)]
                    transition-shadow duration-500
                  "
                >
                  <div className="relative h-64 overflow-hidden bg-[var(--surface-2)]">
                    {product.cloudinary_public_id ? (

                    <CldImage
                      width="960"
                      height="600"
                      src={product.cloudinary_public_id}
                      sizes="100vw"
                      alt="Golf Apparel"
                    />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-black to-[var(--surface-2)] flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-[var(--accent-green)]/40" />
                      </div>
                    )}

                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {product.is_featured && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-[var(--accent-green)] text-black text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {product.brand && (
                      <p className="text-xs text-[var(--accent-green)] font-semibold uppercase tracking-wide mb-1">
                        {product.brand}
                      </p>
                    )}

                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-[var(--accent-green)]">
                        €{product.price}
                      </p>

                      {product.category && (
                        <span className="px-3 py-1 bg-[var(--surface-2)] text-[var(--text-secondary)] text-xs font-medium rounded-full capitalize">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
