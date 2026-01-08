"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Gift, Euro, Lock, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import ProductManagement, { type Product } from "@/components/admin/ProductManagement";
import VoucherManagement from "@/components/admin/VoucherManagement";

const ADMIN_PASSWORD = "proshop2026";

type VoucherPurchase = {
  id: string;
  amount: number;
  buyer_name: string;
  buyer_email: string;
  recipient_name: string | null;
  recipient_email: string | null;
  message: string | null;
  createdAt: string; // ISO string from server
};

type Props = {
  products: Product[];
  purchases: VoucherPurchase[];
};

function getInitialAuth() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("admin_auth") === "true";
}

export default function AdminClient({ products, purchases }: Props) {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getInitialAuth());
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const totalRevenue = useMemo(
    () => purchases.reduce((sum, p) => sum + (p.amount || 0), 0),
    [purchases]
  );
  const totalPurchases = purchases.length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
      return;
    }

    setError("Incorrect password");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setPassword("");
    setError("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Access</h1>
              <p className="text-zinc-400 mt-1">Enter password to continue</p>
            </div>

            <div className="px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full rounded-lg bg-zinc-950 border border-zinc-700 text-white px-3 py-2 outline-none focus:border-emerald-600"
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 font-semibold"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-black">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4C2C] via-emerald-900 to-[#1B4C2C] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-start justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Admin Dashboard
              </h1>
              <p className="text-emerald-400 text-lg">Manage your pro shop</p>
            </motion.div>

            <button
              onClick={handleLogout}
              className="mt-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-4 py-2 text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[#1B4C2C] to-emerald-900 border border-emerald-700/30 shadow-xl rounded-2xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">Total Voucher Revenue</p>
                  <div className="text-4xl font-bold text-white mt-2">€{totalRevenue}</div>
                  <p className="text-xs text-emerald-200/70 mt-1">
                    From {totalPurchases} {totalPurchases === 1 ? "purchase" : "purchases"}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Euro className="h-5 w-5 text-emerald-300" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-emerald-800 to-[#1B4C2C] border border-emerald-700/30 shadow-xl rounded-2xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">Vouchers Sold</p>
                  <div className="text-4xl font-bold text-white mt-2">{totalPurchases}</div>
                  <p className="text-xs text-emerald-200/70 mt-1">Total purchases</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Gift className="h-5 w-5 text-emerald-300" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-6"
          >
            <AdminTabs
              products={products}
              purchases={purchases}
              onProductsChanged={() => router.refresh()}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function AdminTabs({
  products,
  purchases,
  onProductsChanged,
}: {
  products: Product[];
  purchases: {
    id: string;
    amount: number;
    buyer_name: string;
    buyer_email: string;
    recipient_name: string | null;
    recipient_email: string | null;
    message: string | null;
    createdAt: string;
  }[];
  onProductsChanged: () => void;
}) {
  const [tab, setTab] = useState<"products" | "vouchers">("products");

  return (
    <div className="space-y-4">
      <div className="inline-flex bg-white/10 border border-white/10 rounded-xl p-1">
        <button
          onClick={() => setTab("products")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition
            ${tab === "products" ? "bg-[#1B4C2C] text-white" : "text-white/70 hover:text-white"}`}
        >
          <ShoppingBag className="w-4 h-4" />
          Products
        </button>

        <button
          onClick={() => setTab("vouchers")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition
            ${tab === "vouchers" ? "bg-[#1B4C2C] text-white" : "text-white/70 hover:text-white"}`}
        >
          <Gift className="w-4 h-4" />
          Vouchers
        </button>
      </div>

      {tab === "products" ? (
        <ProductManagement initialProducts={products} onChanged={onProductsChanged} />
      ) : (
        <VoucherManagement purchases={purchases} />
      )}
    </div>
  );
}
