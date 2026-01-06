"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

export function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-golf.jpeg"
          alt="Golf course"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a4d2e]/95 via-[#1a4d2e]/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-2 bg-[#c9a962]/20 border border-[#c9a962]/30 text-[#c9a962] text-sm font-medium rounded-full mb-6">
            Welcome to Clontarf Paradise Golf
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Elevate Your
            <span className="block text-[#c9a962]">Golf Game</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-lg">
            Premium vouchers, expert lessons, and everything you need to perfect your swing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#c9a962] hover:bg-[#b8954f] text-[#1a4d2e] font-semibold rounded-full px-8 h-14 group w-full sm:w-auto"
            >
              <Link href={routes.vouchers}>
                Shop Vouchers
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-14 w-full sm:w-auto"
            >
              <Link href={routes.bookLesson}>Book a Lesson</Link>
            </Button>
          </div>
        </motion.div>
      </div>


    </section>
  );
}
