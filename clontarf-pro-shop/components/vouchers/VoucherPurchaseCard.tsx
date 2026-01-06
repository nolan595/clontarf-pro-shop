"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "../../components/ui/Input";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
    >
      {/* Amount Input */}
      <div className="mb-8">
        <Label htmlFor="amount" className="text-lg font-semibold mb-3">
          Voucher Amount
        </Label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-400">
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
            className="h-16 pl-12 text-2xl font-semibold rounded-2xl border-2 focus:border-[#1a4d2e]"
          />
        </div>
      </div>

      {/* Suggested Amounts */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-3">Popular amounts:</p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {suggestedAmounts.map((amount) => {
            const active = voucherAmount === amount.toString();

            return (
              <motion.button
                key={amount}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectSuggested(amount)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  active
                    ? "border-[#1a4d2e] bg-[#1a4d2e]/5 text-[#1a4d2e] font-semibold"
                    : "border-gray-200 hover:border-[#c9a962] text-gray-600"
                }`}
              >
                €{amount}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Purchase Button */}
      <Button
        onClick={onPurchase}
        className="w-full h-14 bg-[#1a4d2e] hover:bg-[#2d6a4f] text-white text-lg font-semibold rounded-2xl group"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        Purchase Voucher{voucherAmount ? ` - €${voucherAmount}` : ""}
      </Button>

      {/* Info */}
      <div className="mt-8 p-6 bg-[#f8f6f1] rounded-2xl">
        <h3 className="font-semibold text-[#2d2d2d] mb-2">What&apos;s included:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {[
            "Redeemable for any pro shop merchandise or services",
            "Can be used for lessons, equipment, or gift items",
            "Never expires - no hidden fees",
            "Digital delivery available for immediate gifting",
          ].map((text) => (
            <li key={text} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#1a4d2e] rounded-full" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
