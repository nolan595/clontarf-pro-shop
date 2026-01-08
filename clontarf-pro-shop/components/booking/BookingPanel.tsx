"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type BookingPanelProps = {
  bookingUrl: string;
};

export function BookingPanel({ bookingUrl }: BookingPanelProps) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Reset states when opening (avoid doing this in useEffect to prevent the React warning)
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
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          rounded-[28px] px-8 py-10 md:px-12 md:py-12 text-center
          border border-[var(--border)] bg-[var(--surface)]
          shadow-[0_20px_80px_rgba(0,0,0,0.45)]
        "
      >
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
          Book Your Lesson
        </h2>

        <p className="text-[var(--text-secondary)] mb-8">
          For the best booking experience on mobile, please open our booking system in a new
          window.
        </p>

        <Button
          size="lg"
          onClick={handleOpen}
          className="rounded-full px-8 h-12 text-base inline-flex items-center gap-2"
        >
          Open Booking System
          <ExternalLink className="w-4 h-4" />
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
            className="
              inline-flex items-center gap-1 text-sm
              text-[var(--accent-green)] hover:brightness-110 transition
            "
          >
            Open in new tab
            <ExternalLink className="w-3 h-3" />
          </a>
        }
        maxWidthClassName="max-w-5xl"
      >
        <div
          className="
            relative h-[75vh] rounded-2xl overflow-hidden
            border border-[var(--border)] bg-[var(--surface)]
          "
        >
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[var(--background)]">
              <div className="h-10 w-10 rounded-full border-4 border-white/15 border-t-[var(--accent-green)] animate-spin" />

              <div className="text-center">
                <p className="font-semibold text-[var(--text-primary)]">
                  Loading booking…
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Just a sec while we fetch available times.
                </p>

                {showFallback && (
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    Taking longer than expected?{" "}
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--accent-green)] hover:brightness-110 underline underline-offset-4"
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
