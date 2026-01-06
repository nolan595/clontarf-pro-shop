"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Filter } from "lucide-react";
import Select from "@/components/ui/Select";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
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
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Hero */}
      <section className="relative py-24 bg-[#1a4d2e]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=1920&q=80')] bg-cover bg-center" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#c9a962]/20 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-[#c9a962]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Products
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
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
            <Filter className="w-5 h-5 text-gray-500" />

            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={CATEGORIES as unknown as { value: string; label: string }[]}
              className="w-48"
            />

            <span className="text-sm text-gray-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </motion.div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No products available yet</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1a4d2e] to-[#2d6a4f] flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-[#c9a962]/50" />
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
                      <span className="absolute top-4 right-4 px-3 py-1 bg-[#c9a962] text-[#1a4d2e] text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {product.brand && (
                      <p className="text-xs text-[#c9a962] font-semibold uppercase tracking-wide mb-1">
                        {product.brand}
                      </p>
                    )}

                    <h3 className="text-lg font-semibold text-[#2d2d2d] mb-2">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-[#1a4d2e]">
                        €{product.price.toFixed(2)}
                      </p>

                      {product.category && (
                        <span className="px-3 py-1 bg-[#f8f6f1] text-[#2d2d2d] text-xs font-medium rounded-full capitalize">
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
