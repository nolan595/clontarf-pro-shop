"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

type VoucherPurchaseCardProps = {
  voucherAmount: string;
  onChangeAmount: (value: string) => void;
  onSelectSuggested: (amount: number) => void;
  onPurchase: () => void;
};

export function VoucherPurchaseCard({
  voucherAmount,
  onChangeAmount,
  onSelectSuggested,
  onPurchase,
}: VoucherPurchaseCardProps) {
  const suggestedAmounts = useMemo(() => [25, 50, 100, 150, 200, 250], []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-3xl p-8 md:p-12
        border border-[var(--border)] bg-[var(--surface)]
        shadow-[0_20px_80px_rgba(0,0,0,0.45)]
      "
    >
      {/* Amount Input */}
      <div className="mb-8">
        <Label htmlFor="amount" className="text-lg font-semibold mb-3">
          Voucher Amount
        </Label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-white/35">
            €
          </span>

          <Input
            id="amount"
            type="number"
            min={1}
            step={1}
            value={voucherAmount}
            onChange={(e) => onChangeAmount(e.target.value)}
            placeholder="Enter amount"
            className="
              h-16 pl-12 text-2xl font-semibold rounded-2xl
              border border-[var(--border)] bg-[var(--surface)]
              focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent-green)_35%,transparent)]
            "
          />
        </div>
      </div>

      {/* Suggested Amounts */}
      <div className="mb-8">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Popular amounts:
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {suggestedAmounts.map((amount) => {
            const active = voucherAmount === amount.toString();

            return (
              <motion.button
                key={amount}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectSuggested(amount)}
                className={[
                  "p-4 rounded-xl border text-sm font-medium transition-colors",
                  active
                    ? "border-[color-mix(in_srgb,var(--accent-green)_55%,transparent)] bg-[color-mix(in_srgb,var(--accent-green)_10%,transparent)] text-[var(--accent-green)]"
                    : "border-[var(--border)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
                ].join(" ")}
              >
                €{amount}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Purchase Button */}
      <Button onClick={onPurchase} className="w-full h-14 rounded-2xl text-lg group">
        <CreditCard className="w-5 h-5 mr-2" />
        Purchase Voucher{voucherAmount ? ` - €${voucherAmount}` : ""}
      </Button>

      {/* Info */}
      <div className="mt-8 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]">
        <h3 className="font-semibold text-[var(--text-primary)] mb-2">
          What&apos;s included:
        </h3>

        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          {[
            "Redeemable for any pro shop merchandise or services",
            "Can be used for lessons, equipment, or gift items",
            "Never expires - no hidden fees",
            "Digital delivery available for immediate gifting",
          ].map((text) => (
            <li key={text} className="flex items-start gap-2">
              <div className="mt-2 w-1.5 h-1.5 bg-[var(--accent-green)] rounded-full shrink-0" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
