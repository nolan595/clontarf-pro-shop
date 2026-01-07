"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

export function VouchersHero() {
  return (
    <section className="relative py-24 overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/vouchers-hero.jpeg"
          alt="Golf vouchers"
          fill
          priority
          className="object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Left vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        {/* Bottom fade into page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="
              w-16 h-16 mx-auto mb-6 rounded-2xl
              border border-[var(--border)]
              bg-[var(--surface)]
              flex items-center justify-center
            "
          >
            <Gift className="w-8 h-8 text-[var(--accent-green)]" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Gift Vouchers
          </h1>

          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Choose any amount. Perfect for birthdays, holidays, or any special
            occasion.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
