"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, Gift, User } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";

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
      const doc = new jsPDF();

      // Dark background
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, 210, 297, "F");

      // Header with emerald accent
      doc.setFillColor(16, 185, 129);
      doc.rect(0, 0, 210, 50, "F");

      // Business name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(32);
      doc.text("Eoin O'Brien Golf", 105, 30, { align: "center" });

      // Amount box
      doc.setFillColor(39, 39, 42);
      doc.roundedRect(50, 80, 110, 50, 8, 8, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("GIFT VOUCHER", 105, 100, { align: "center" });

      doc.setTextColor(16, 185, 129);
      doc.setFontSize(42);
      doc.text(`€${purchase.amount}`, 105, 120, { align: "center" });

      // Details section
      let yPos = 160;

      if (purchase.recipient_name) {
        doc.setFontSize(11);
        doc.setTextColor(161, 161, 170);
        doc.text("TO:", 50, yPos);

        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text(purchase.recipient_name, 50, yPos + 10);

        yPos += 30;
      }

      if (purchase.message) {
        doc.setFontSize(11);
        doc.setTextColor(161, 161, 170);
        doc.text("MESSAGE:", 50, yPos);

        doc.setFontSize(12);
        doc.setTextColor(228, 228, 231);
        const split = doc.splitTextToSize(purchase.message, 110);
        doc.text(split, 50, yPos + 10);

        yPos += 15 + split.length * 6;
      }

      // Valid for section
      doc.setFillColor(39, 39, 42);
      doc.roundedRect(50, 220, 110, 30, 5, 5, "F");

      doc.setFontSize(10);
      doc.setTextColor(161, 161, 170);
      doc.text("VALID FOR", 105, 232, { align: "center" });

      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text("Lessons • Equipment • Pro Shop", 105, 242, { align: "center" });

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text("Redeemable for any golf lessons, equipment, or pro shop merchandise", 105, 265, {
        align: "center",
      });
      doc.text(`Voucher Code: ${purchase.id.substring(0, 8).toUpperCase()}`, 105, 272, {
        align: "center",
      });
      doc.text("Never expires • Non-refundable", 105, 279, { align: "center" });

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
                    className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                    title="Download voucher PDF"
                  >
                    <Download className="w-4 h-4" />
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
