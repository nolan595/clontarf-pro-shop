"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import SumUpCardWidget from "./SumUpCardWidget";

export type BuyerInfo = {
  name: string;
  email: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
};

type VoucherPurchaseModalProps = {
  open: boolean;
  amount: string;
  buyerInfo: BuyerInfo;

  // NEW: 2-step modal
  step: "details" | "payment";
  voucherPurchaseId?: string | null;

  onClose: () => void;
  onChangeBuyerInfo: (next: BuyerInfo) => void;

  // Keep your existing handler name
  onSubmit: (e: React.FormEvent) => void;

  // NEW: called when payment confirmed
  onPaid: () => void;
};

export function VoucherPurchaseModal({
  open,
  amount,
  buyerInfo,
  step,
  voucherPurchaseId,
  onClose,
  onChangeBuyerInfo,
  onSubmit,
  onPaid,
}: VoucherPurchaseModalProps) {
  const title = step === "details" ? "Complete Your Purchase" : "Pay Securely";

  return (
    <Modal
      open={open}
      // recommended: avoid closing while payment UI is open (reduces edge-case confusion)
      onClose={onClose}
      title={title}
      description={
        <span className="text-[var(--accent-green)] font-semibold text-lg">
          €{amount} Voucher
        </span>
      }
      maxWidthClassName="max-w-md"
    >
      {step === "details" ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              value={buyerInfo.name}
              onChange={(e) =>
                onChangeBuyerInfo({ ...buyerInfo, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Your Email *</Label>
            <Input
              id="email"
              type="email"
              value={buyerInfo.email}
              onChange={(e) =>
                onChangeBuyerInfo({ ...buyerInfo, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientName">Recipient Name (optional)</Label>
            <Input
              id="recipientName"
              value={buyerInfo.recipientName}
              onChange={(e) =>
                onChangeBuyerInfo({
                  ...buyerInfo,
                  recipientName: e.target.value,
                })
              }
              placeholder="Leave blank if for yourself"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Recipient Email (optional)</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={buyerInfo.recipientEmail}
              onChange={(e) =>
                onChangeBuyerInfo({
                  ...buyerInfo,
                  recipientEmail: e.target.value,
                })
              }
              placeholder="recipient@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Gift Message (optional)</Label>
            <Input
              id="message"
              value={buyerInfo.message}
              onChange={(e) =>
                onChangeBuyerInfo({ ...buyerInfo, message: e.target.value })
              }
              placeholder="Happy Birthday!"
            />
          </div>

          <Button type="submit" className="w-full rounded-full h-12 font-semibold">
            Continue to secure payment
          </Button>

          <p className="text-xs text-[var(--text-secondary)] text-center">
            You’ll pay securely by card in the next step.
          </p>
        </form>
      ) : (
        <div className="space-y-3">
          {!voucherPurchaseId ? (
            <div className="text-sm opacity-80">Preparing secure checkout…</div>
          ) : (
            <SumUpCardWidget voucherPurchaseId={voucherPurchaseId} onPaid={onPaid} />
          )}

          <p className="text-xs text-[var(--text-secondary)] text-center">
            Payments are processed securely by SumUp.
          </p>

          {/* Optional: allow cancel/back button during payment step if you want.
              If you enable this, your parent should handle it safely. */}
          {/* <Button type="button" variant="ghost" className="w-full" onClick={onClose}>
            Cancel
          </Button> */}
        </div>
      )}
    </Modal>
  );
}
