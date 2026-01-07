"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

export function Cta() {
  return (
    <section className="py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-[var(--border)]"
        >
          <div className="relative w-full h-[420px]">
            <Image
              src="/images/cta-lesson.jpeg"
              alt="Golf lesson"
              fill
              className="object-cover"
              priority={false}
            />

            {/* Dark theme overlay + subtle vignette */}
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/20" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-16 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Ready to Improve Your Game?
              </h2>

              <p className="text-[var(--text-secondary)] mb-8">
                Book a lesson with our PGA certified professional and take your golf
                to the next level.
              </p>

              <Button asChild size="lg" className="rounded-full px-8 h-14 group">
                <Link href={routes.bookLesson}>
                  Book Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
