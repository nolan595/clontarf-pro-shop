"use client";

import { motion } from "framer-motion";
import { features } from "./homeData";

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#2d2d2d] mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Your destination for premium golf experiences and gifts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-3xl bg-[#f8f6f1] hover:bg-[#1a4d2e] group transition-colors duration-500"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#1a4d2e] group-hover:bg-[#c9a962] flex items-center justify-center transition-colors duration-500">
                  <Icon className="w-8 h-8 text-[#c9a962] group-hover:text-[#1a4d2e] transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-semibold text-[#2d2d2d] group-hover:text-white mb-3 transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="text-gray-500 group-hover:text-white/70 transition-colors duration-500">
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
