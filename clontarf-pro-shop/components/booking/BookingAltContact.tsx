"use client";

import { motion } from "framer-motion";

export function BookingAltContact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-12 text-center"
    >
      <p className="text-gray-500 mb-4">Prefer to book by phone?</p>

      <a
        href="tel: 01 8331892"
        className="inline-flex items-center gap-2 text-[#1a4d2e] font-semibold hover:text-[#2d6a4f] transition-colors"
      >
        Call us at 01 8331892
      </a>
    </motion.div>
  );
}
