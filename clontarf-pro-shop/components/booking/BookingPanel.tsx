"use client";

import { motion } from "framer-motion";
import { Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useIsMobile } from "../../hooks/useIsMobile";

type BookingPanelProps = {
  bookingUrl: string;
};

export function BookingPanel({ bookingUrl }: BookingPanelProps) {
  const isMobile = useIsMobile(768);

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#c9a962]/20 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-[#c9a962]" />
        </div>

        <h2 className="text-2xl font-bold text-[#2d2d2d] mb-4">Book Your Lesson</h2>

        <p className="text-gray-600 mb-8">
          For the best booking experience on mobile, please open our booking system in a new
          window.
        </p>

        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
          <Button
            size="lg"
            className="bg-[#1a4d2e] hover:bg-[#2d6a4f] text-white rounded-full px-8 h-14 text-base group"
          >
            Open Booking System
            <ExternalLink className="w-5 h-5 ml-2" />
          </Button>
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm overflow-hidden"
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-[#2d2d2d]">Book Your Lesson</h2>

        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#1a4d2e] hover:text-[#2d6a4f] flex items-center gap-1"
        >
          Open in new tab
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="relative h-[800px]">
        <iframe
          src={bookingUrl}
          className="w-full h-full"
          style={{ border: "none" }}
          title="Booking System"
          allow="payment"
        />
      </div>
    </motion.div>
  );
}
