"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

export function Cta() {
  return (
    <section className="py-24 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="relative w-full h-[400px]">
            <Image
              src="/images/cta-lesson.jpeg"
              alt="Golf lesson"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a4d2e]/95 to-[#1a4d2e]/70" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-16 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Improve Your Game?
              </h2>
              <p className="text-white/80 mb-8">
                Book a lesson with our PGA certified professionals and take your golf to the next level.
              </p>

              <Button
                asChild
                size="lg"
                className="bg-[#c9a962] hover:bg-[#b8954f] text-[#1a4d2e] font-semibold rounded-full px-8 h-14 group"
              >
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
