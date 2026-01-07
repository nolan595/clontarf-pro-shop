"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

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
  onClose: () => void;
  onChangeBuyerInfo: (next: BuyerInfo) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function VoucherPurchaseModal({
  open,
  amount,
  buyerInfo,
  onClose,
  onChangeBuyerInfo,
  onSubmit,
}: VoucherPurchaseModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Complete Your Purchase"
      description={
        <span className="text-[var(--accent-green)] font-semibold text-lg">
          €{amount} Voucher
        </span>
      }
      maxWidthClassName="max-w-md"
    >
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
              onChangeBuyerInfo({ ...buyerInfo, recipientName: e.target.value })
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
          Submit Purchase Request
        </Button>

        <p className="text-xs text-[var(--text-secondary)] text-center">
          We&apos;ll contact you to complete payment and deliver your voucher
        </p>
      </form>
    </Modal>
  );
}
