"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import SumUpCardWidget from "./SumUpCardWidget";

export default function PaymentModal({
  open,
  onClose,
  voucherPurchaseId,
  onPaid,
}: {
  open: boolean;
  onClose: () => void;
  voucherPurchaseId: string;
  onPaid: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-semibold">Pay with card</div>
            <div className="text-xs opacity-70">Secure payment powered by SumUp</div>
          </div>

          <button onClick={onClose} className="text-sm opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>

        <SumUpCardWidget voucherPurchaseId={voucherPurchaseId} onPaid={onPaid} />

        <div className="mt-3 text-[11px] opacity-60 text-center">
          Please don’t refresh while processing — we’ll confirm automatically.
        </div>
      </div>
    </div>,
    document.body
  );
}
