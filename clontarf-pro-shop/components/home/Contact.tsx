"use client";

import { motion } from "framer-motion";

export function Contact() {
  return (
    <section className="py-16 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2d] mb-6">
            Get in Touch
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {/* Email */}
            <a
              href="mailto:info@theproshop.com"
              className="flex items-center gap-3 text-[#1a4d2e] hover:text-[#2d6a4f] transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-[#c9a962]/20 flex items-center justify-center group-hover:bg-[#c9a962]/30 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div className="text-left">
                <p className="text-sm text-gray-500 mb-0.5">Email us</p>
                <p className="text-lg font-semibold">info@ClontarfGolfClub.com</p>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:+1234567890"
              className="flex items-center gap-3 text-[#1a4d2e] hover:text-[#2d6a4f] transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-[#c9a962]/20 flex items-center justify-center group-hover:bg-[#c9a962]/30 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>

              <div className="text-left">
                <p className="text-sm text-gray-500 mb-0.5">Call us</p>
                <p className="text-lg font-semibold">+123 456 7890</p>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
