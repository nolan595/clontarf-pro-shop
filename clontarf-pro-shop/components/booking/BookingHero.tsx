"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export function BookingHero() {
  return (
    <section className="relative py-24 bg-[#1a4d2e] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/cta-lesson.jpg"
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#c9a962]/20 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-[#c9a962]" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Book a Lesson
          </h1>

          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Schedule a session with our PGA certified professional
          </p>
        </motion.div>
      </div>
    </section>
  );
}
