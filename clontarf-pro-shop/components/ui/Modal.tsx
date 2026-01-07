"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import clsx from "clsx";

type ModalProps = {
  open: boolean;
  title?: string;
  description?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClassName?: string;
};

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  maxWidthClassName = "max-w-md",
}: ModalProps) {
  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      {/* overlay */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* panel */}
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <div
          className={clsx(
            "w-full rounded-2xl overflow-hidden",
            "border border-[var(--border)] bg-[var(--background)]",
            "shadow-[0_24px_80px_rgba(0,0,0,0.65)]",
            maxWidthClassName
          )}
        >
          <div className="p-5 border-b border-[var(--border)] flex items-start justify-between gap-4">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {title}
                </h3>
              )}
              {description && (
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  {description}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className={clsx(
                "p-2 rounded-xl transition",
                "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                "hover:bg-[var(--surface)]"
              )}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
