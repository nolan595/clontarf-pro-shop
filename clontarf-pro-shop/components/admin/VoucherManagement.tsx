"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, Gift, User } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { buildVoucherPdf } from "@/lib/voucherPdf";

type VoucherPurchase = {
  id: string;
  amount: number;
  buyer_name: string;
  buyer_email: string;
  recipient_name: string | null;
  recipient_email: string | null;
  message: string | null;
  createdAt: string; // ISO string from server (page.tsx)
};

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Something went wrong";
  }
}

export default function VoucherManagement({ purchases }: { purchases: VoucherPurchase[] }) {
const downloadVoucher = (purchase: VoucherPurchase) => {
  try {
    const doc = buildVoucherPdf({
      id: purchase.id,
      amount: purchase.amount,
      recipient_name: purchase.recipient_name,
      message: purchase.message,
      buyer_name: purchase.buyer_name
    });

    doc.save(`voucher-${purchase.id}.pdf`);
    toast.success("Voucher downloaded");
  } catch (err: unknown) {
    toast.error(getErrorMessage(err));
  }
};

  return (
    <div className="bg-white rounded-2xl border border-black/10 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-[#111]">Voucher Purchases</h2>
      </div>

      <div className="p-6">
        {purchases.length === 0 ? (
          <div className="text-center py-16">
            <Gift className="w-14 h-14 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No voucher purchases yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-2xl font-bold text-[#1a4d2e]">€{purchase.amount}</div>
                    <p className="text-xs text-gray-500">
                      {new Date(purchase.createdAt).toLocaleDateString("en-IE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => downloadVoucher(purchase)}
                    className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                    title="Download voucher PDF"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Buyer</span>
                    </div>
                    <p className="text-gray-900">{purchase.buyer_name}</p>
                    <p className="text-gray-500 text-xs">{purchase.buyer_email}</p>
                  </div>

                  {purchase.recipient_name && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Gift className="w-4 h-4" />
                        <span className="font-medium">Recipient</span>
                      </div>
                      <p className="text-gray-900">{purchase.recipient_name}</p>
                      {purchase.recipient_email && (
                        <p className="text-gray-500 text-xs">{purchase.recipient_email}</p>
                      )}
                    </div>
                  )}
                </div>

                {purchase.message && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Message</p>
                    <p className="text-sm text-gray-700 italic">
                      &ldquo;{purchase.message}&rdquo;
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
