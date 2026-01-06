"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

export function VouchersHero() {
  return (
    <section className="relative py-24 bg-[#1a4d2e] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/vouchers-hero.jpeg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#c9a962]/20 flex items-center justify-center">
            <Gift className="w-8 h-8 text-[#c9a962]" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gift Vouchers
          </h1>

          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Choose any amount. Perfect for birthdays, holidays, or any special occasion.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
