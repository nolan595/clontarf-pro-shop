"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

type CreateVoucherPurchaseResponse = {
  id: string;
};

async function postJSON<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json() as Promise<TResponse>;
}

export function VouchersPage() {
  const router = useRouter();

  const [voucherAmount, setVoucherAmount] = React.useState("");
  const [purchaseOpen, setPurchaseOpen] = React.useState(false);

  const [buyerInfo, setBuyerInfo] = React.useState<BuyerInfo>(EMPTY_BUYER);

  // NEW: modal steps + created purchase id
  const [step, setStep] = React.useState<"details" | "payment">("details");
  const [voucherPurchaseId, setVoucherPurchaseId] = React.useState<string | null>(null);

  // Optional: block double submits
  const [submitting, setSubmitting] = React.useState(false);

  function resetFlow() {
    setPurchaseOpen(false);
    setStep("details");
    setVoucherPurchaseId(null);
    setBuyerInfo(EMPTY_BUYER);
    setVoucherAmount("");
    setSubmitting(false);
  }

  function handleSelectAmount(amount: number) {
    setVoucherAmount(String(amount));
  }

  function handlePurchase() {
    const amountNum = Number(voucherAmount);

    if (!voucherAmount || !Number.isFinite(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // start fresh each time
    setStep("details");
    setVoucherPurchaseId(null);

    setPurchaseOpen(true);
  }

  async function handleSubmitPurchase(e: React.FormEvent) {
    e.preventDefault();

    if (submitting) return;

    const amountNum = Number(voucherAmount);

    if (!voucherAmount || !Number.isFinite(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!buyerInfo.name.trim() || !buyerInfo.email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }

    setSubmitting(true);

    try {
      // 1) Create voucher purchase (local order)
      const created = await postJSON<CreateVoucherPurchaseResponse>(
        "/api/voucher-purchases",
        {
          amount: amountNum,
          buyer_name: buyerInfo.name.trim(),
          buyer_email: buyerInfo.email.trim(),
          recipient_name: buyerInfo.recipientName.trim() || null,
          recipient_email: buyerInfo.recipientEmail.trim() || null,
          message: buyerInfo.message || null,
        }
      );

      // 2) Move to payment step
      setVoucherPurchaseId(created.id);
      setStep("payment");
    } catch (err) {
      console.error(err);
      toast.error("Could not start checkout. Please try again.");
      setSubmitting(false);
    }
  }

  function handlePaid() {
    toast.success("Payment received — your voucher is on the way");
    resetFlow();

    // Optional: route somewhere nice / show success banner
    // router.push("/?message=order_success");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <VouchersHero />

      {/* Main content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <VoucherPurchaseCard
            voucherAmount={voucherAmount}
            onChangeAmount={setVoucherAmount}
            onSelectSuggested={handleSelectAmount}
            onPurchase={handlePurchase}
          />

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Secure checkout — pay instantly by card and receive your voucher by email.
          </p>
        </div>
      </section>

      <VoucherPurchaseModal
        open={purchaseOpen}
        amount={voucherAmount}
        buyerInfo={buyerInfo}
        step={step}
        voucherPurchaseId={voucherPurchaseId}
        onClose={resetFlow}
        onChangeBuyerInfo={setBuyerInfo}
        onSubmit={handleSubmitPurchase}
        onPaid={handlePaid}
      />
    </div>
  );
}
