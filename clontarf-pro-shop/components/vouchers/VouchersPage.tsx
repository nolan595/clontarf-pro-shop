"use client";

import { useState } from "react";
import { toast } from "sonner";
import { VouchersHero } from "./VouchersHero";
import { VoucherPurchaseCard } from "./VoucherPurchaseCard";
import { VoucherPurchaseModal, type BuyerInfo } from "./VoucherPurchaseModal";

const EMPTY_BUYER: BuyerInfo = {
  name: "",
  email: "",
  recipientName: "",
  recipientEmail: "",
  message: "",
};

export function VouchersPage() {
  const [voucherAmount, setVoucherAmount] = useState("");
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>(EMPTY_BUYER);

  function handleSelectAmount(amount: number) {
    setVoucherAmount(amount.toString());
  }

  function handlePurchase() {
    const amountNum = Number(voucherAmount);

    if (!voucherAmount || !Number.isFinite(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setPurchaseOpen(true);
  }

  function handleSubmitPurchase(e: React.FormEvent) {
    e.preventDefault();

    toast.success(
      `Thank you! Your €${voucherAmount} voucher purchase request has been received. We will contact you shortly.`
    );

    setPurchaseOpen(false);
    setBuyerInfo(EMPTY_BUYER);
    setVoucherAmount("");
  }

  return (
    <div className="min-h-screen">
      <VouchersHero />

      {/* Important: give padded sections a background so we never get “black gaps” */}
      <section className="py-16 bg-[#f8f6f1]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <VoucherPurchaseCard
            voucherAmount={voucherAmount}
            onChangeAmount={setVoucherAmount}
            onSelectSuggested={handleSelectAmount}
            onPurchase={handlePurchase}
          />
        </div>
      </section>

      <VoucherPurchaseModal
        open={purchaseOpen}
        amount={voucherAmount}
        buyerInfo={buyerInfo}
        onClose={() => setPurchaseOpen(false)}
        onChangeBuyerInfo={setBuyerInfo}
        onSubmit={handleSubmitPurchase}
      />
    </div>
  );
}
