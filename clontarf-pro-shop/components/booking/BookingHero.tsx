"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export function BookingHero() {
  return (
    <section className="relative min-h-[320px] md:min-h-[420px] overflow-hidden bg-black flex items-center">
      <div className="absolute inset-0">
        <Image
          src="/images/cta-lesson.jpeg"
          alt="Golf lesson booking"
          fill
          priority={false}
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center py-20 md:py-24">
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
            <Calendar className="w-8 h-8 text-[var(--accent-green)]" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
            Book a Lesson
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Schedule a session with our PGA certified professional
          </p>
        </motion.div>
      </div>
    </section>
  );
}
