"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

export function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-golf.jpeg"
          alt="Golf course"
          fill
          priority
          className="object-cover"
        />

        {/* Global dark overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Left vignette (heavy) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />

        {/* Top “blur/soft” band like screenshot */}
        <div className="absolute top-0 left-0 right-0 h-44 bg-white/15 blur-2xl opacity-60" />

        {/* Bottom fade into page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Better Golf
            <br />
            Starts Here.
          </h1>

          <p className="mt-6 max-w-xl text-base md:text-lg text-white/65 leading-relaxed">
            A modern pro shop offering top-tier brands, trusted expertise and a welcoming space for members and visitors
            1:1 coaching available for those looking to sharpen their swing.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {/* Primary CTA */}
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 h-14 w-full sm:w-auto bg-[#11B981] text-black hover:brightness-110 active:brightness-95"
            >
              <Link href={routes.bookLesson}>Book a lesson</Link>
            </Button>

            {/* Secondary (ghost-ish) */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
            >
              <Link href={routes.vouchers}>Buy a voucher</Link>
            </Button>

                        <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-14 w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
            >
              <Link href={routes.products}>Products</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
