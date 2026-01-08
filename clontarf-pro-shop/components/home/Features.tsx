"use client";

import { motion } from "framer-motion";
import { features } from "./homeData";

export function Features() {
  return (
    <section className="py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Why Choose Us
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Your destination for premium golf experiences and gifts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="
                  group text-center p-8 rounded-3xl
                  border border-[var(--border)] bg-[var(--surface)]
                  hover:bg-[var(--surface-2)]
                  transition-colors duration-500
                "
              >
                <div
                  className="
                    w-16 h-16 mx-auto mb-6 rounded-2xl
                    bg-black/40 border border-[var(--border)]
                    flex items-center justify-center
                    transition-colors duration-500
                    group-hover:border-[color-mix(in_srgb,var(--accent-green)_35%,transparent)]
                  "
                >
                  <Icon className="w-8 h-8 text-[var(--accent-green)]" />
                </div>

                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  {feature.title}
                </h3>

                <p className="text-[var(--text-secondary)]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
