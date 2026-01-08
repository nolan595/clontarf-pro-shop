"use client";

import { motion } from "framer-motion";

export function BookingAltContact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-10 text-center"
    >
      <p className="text-sm md:text-base text-[var(--text-secondary)] mb-3">
        Prefer to book by phone?
      </p>

      <a
        href="tel:018331892"
        className="
          inline-flex items-center gap-2 font-semibold
          text-[var(--accent-green)]
          hover:brightness-110 transition
        "
      >
        Call us at 01 833 1892
      </a>
    </motion.div>
  );
}
