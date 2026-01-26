"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Filter } from "lucide-react";

import { CldImage } from "next-cloudinary";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cloudinary_public_id: string | null;

};

export default function ServicesClient({ services }: { services: Service[] }) {

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-golf.jpeg"
            alt="Golf Services"
            fill
            priority={false}
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-[var(--accent-green)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Our Services
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Expert golf services to sharpen your game - fittings, repairs, and coaching tailored to you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filter */}


          {/* Services Grid */}
          {services.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-[var(--text-secondary)]">No services available yet</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="
                    rounded-2xl overflow-hidden
                    border border-[var(--border)] bg-[var(--surface)]
                    shadow-[0_16px_50px_rgba(0,0,0,0.35)]
                    hover:shadow-[0_26px_70px_rgba(0,0,0,0.45)]
                    transition-shadow duration-500
                  "
                >
                  <div className="relative h-64 overflow-hidden bg-[var(--surface-2)]">
                    {service.cloudinary_public_id ? (

                    <CldImage
                      width="960"
                      height="600"
                      src={service.cloudinary_public_id}
                      sizes="100vw"
                      alt="Golf Apparel"
                    />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-black to-[var(--surface-2)] flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-[var(--accent-green)]/40" />
                      </div>
                    )}



                  </div>

                  {/* Content */}
                  <div className="p-6">
  

                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                      {service.name}
                    </h3>

                    {service.description && (
                      <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {service.price > 0 && (
                        <p className="text-2xl font-bold text-[var(--accent-green)]">
                          €{service.price}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
