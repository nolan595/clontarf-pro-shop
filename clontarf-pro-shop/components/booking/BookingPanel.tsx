"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type BookingPanelProps = {
  bookingUrl: string;
};

export function BookingPanel({ bookingUrl }: BookingPanelProps) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  function handleOpen() {
    setLoaded(false);
    setShowFallback(false);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const t = window.setTimeout(() => setShowFallback(true), 5000);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#c9a962]/20 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-[#c9a962]" />
        </div>

        <h2 className="text-2xl font-bold text-[#2d2d2d] mb-4">
          Book Your Lesson
        </h2>

        <p className="text-gray-600 mb-8">
          Choose a time that suits you using our online booking system.
        </p>

        <Button
          size="lg"
          onClick={handleOpen}
          className="bg-[#1a4d2e] hover:bg-[#2d6a4f] text-white rounded-full px-8 h-14 text-base"
        >
          Open Booking System
        </Button>
      </motion.div>

      <Modal
        open={open}
        onClose={handleClose}
        title="Book Your Lesson"
        description={
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#1a4d2e] hover:text-[#2d6a4f]"
          >
            Open in new tab
            <ExternalLink className="w-3 h-3" />
          </a>
        }
        maxWidthClassName="max-w-5xl"
      >
        <div className="relative h-[75vh] rounded-xl overflow-hidden bg-white">
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white">
              <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-[#1a4d2e] animate-spin" />
              <div className="text-center">
                <p className="font-semibold text-[#2d2d2d]">Loading booking…</p>
                <p className="text-sm text-gray-500">
                  Just a sec while we fetch available times.
                </p>

                {showFallback && (
                  <p className="mt-3 text-sm text-gray-500">
                    Taking longer than expected?{" "}
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#1a4d2e] hover:text-[#2d6a4f] underline underline-offset-4"
                    >
                      Open in a new tab
                    </a>
                    .
                  </p>
                )}
              </div>
            </div>
          )}

          <iframe
            src={bookingUrl}
            title="Lesson Booking"
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
            allow="payment"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </Modal>
    </>
  );
}
