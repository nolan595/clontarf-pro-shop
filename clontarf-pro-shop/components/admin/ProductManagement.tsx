"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Plus, ShoppingBag, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type ProductCategory = "clubs" | "balls" | "apparel" | "accessories" | "shoes" | "bags";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: ProductCategory | null;
  brand: string | null;
  is_featured: boolean;
  in_stock: boolean;
};

type Props = {
  initialProducts: Product[];
  /** Optional: if you want to force a server refresh after writes */
  onChanged?: () => void;
};

type ProductDraft = {
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: ProductCategory;
  brand: string;
  is_featured: boolean;
  in_stock: boolean;
};

const EMPTY_DRAFT: ProductDraft = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  category: "clubs",
  brand: "",
  is_featured: false,
  in_stock: true,
};

export default function ProductManagement({ initialProducts, onChanged }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // lightweight modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);

  // Keep local list in sync if parent rerenders with new props (optional pattern)
  React.useEffect(() => setProducts(initialProducts), [initialProducts]);

  const featuredCount = useMemo(() => products.filter((p) => p.is_featured).length, [products]);

  function openCreate() {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setIsOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setDraft({
      name: p.name ?? "",
      description: p.description ?? "",
      price: String(p.price ?? ""),
      image_url: p.image_url ?? "",
      category: (p.category ?? "clubs") as ProductCategory,
      brand: p.brand ?? "",
      is_featured: !!p.is_featured,
      in_stock: !!p.in_stock,
    });
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditing(null);
    setDraft(EMPTY_DRAFT);
  }

  async function api<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || `Request failed (${res.status})`);
    }
    return (await res.json()) as T;
  }

  function getErrorMessage(err: unknown, fallback: string) {
    if (err instanceof Error && err.message) return err.message;
    return fallback;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!draft.name.trim() || !draft.price.trim()) {
      toast.error("Please fill in product name and price.");
      return;
    }

    const price = Number(draft.price);
    if (Number.isNaN(price) || price < 0) {
      toast.error("Price must be a valid number.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: draft.name.trim(),
        description: draft.description.trim() ? draft.description.trim() : null,
        price,
        image_url: draft.image_url.trim() ? draft.image_url.trim() : null,
        category: draft.category,
        brand: draft.brand.trim() ? draft.brand.trim() : null,
        is_featured: draft.is_featured,
        in_stock: draft.in_stock,
      };

      if (editing) {
        const updated = await api<Product>(`/api/products/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        setProducts((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
        toast.success("Product updated");
      } else {
        const created = await api<Product>(`/api/products`, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        // prepend so it appears quickly even before server refresh
        setProducts((prev) => [created, ...prev]);
        toast.success("Product created");
      }

      closeModal();
      onChanged?.();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Something went wrong"));
    } finally {
      setSaving(false);
    }
  }

  async function toggleFeatured(p: Product) {
    // optimistic update
    setProducts((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, is_featured: !x.is_featured } : x))
    );

    try {
      const updated = await api<Product>(`/api/products/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_featured: !p.is_featured }),
      });

      setProducts((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
      onChanged?.();
    } catch (err: unknown) {
      // rollback
      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, is_featured: p.is_featured } : x))
      );
      toast.error(getErrorMessage(err, "Failed to update featured status"));
    }
  }

  async function toggleStock(p: Product) {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, in_stock: !x.in_stock } : x)));

    try {
      const updated = await api<Product>(`/api/products/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ in_stock: !p.in_stock }),
      });

      setProducts((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
      onChanged?.();
    } catch (err: unknown) {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, in_stock: p.in_stock } : x)));
      toast.error(getErrorMessage(err, "Failed to update stock"));
    }
  }

  async function deleteProduct(p: Product) {
    const ok = confirm(`Delete "${p.name}"?`);
    if (!ok) return;

    // optimistic remove
    const prev = products;
    setProducts((curr) => curr.filter((x) => x.id !== p.id));

    try {
      await api<{ ok: true }>(`/api/products/${p.id}`, { method: "DELETE" });
      toast.success("Product deleted");
      onChanged?.();
    } catch (err: unknown) {
      setProducts(prev);
      toast.error(getErrorMessage(err, "Failed to delete product"));
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-black/10 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
      <div className="p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111]">Product Management</h2>
          <p className="text-sm text-gray-500">
            {products.length} products • {featuredCount} featured
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="px-6 pb-6">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-14 h-14 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No products yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {products.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-400" />
                      </div>
                    )}

                    {p.is_featured && (
                      <div className="absolute top-0 right-0 bg-emerald-600 rounded-bl-lg p-1">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#222] truncate">{p.name}</h4>
                    <p className="text-sm text-gray-500">
                      €{p.price.toFixed(2)} • {p.brand || "No brand"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {!p.in_stock && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          Out of Stock
                        </span>
                      )}
                      {p.is_featured && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleFeatured(p)}
                      className={`p-2 rounded-lg hover:bg-gray-100 ${
                        p.is_featured ? "text-emerald-700" : "text-gray-400"
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className={`w-5 h-5 ${p.is_featured ? "fill-current" : ""}`} />
                    </button>

                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-blue-600"
                      title="Edit Product"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>

                    <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
                      <input
                        type="checkbox"
                        checked={p.in_stock}
                        onChange={() => toggleStock(p)}
                        className="w-10 h-5 accent-emerald-600"
                        title="Toggle In Stock"
                      />
                    </label>

                    <button
                      onClick={() => deleteProduct(p)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                      title="Delete Product"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal (no extra UI lib) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-black/20 shadow-2xl">
            <div className="p-5 border-b border-black/10 flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-900">
                {editing ? "Edit Product" : "Add Product"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">Product Name *</label>
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    className="w-full border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">Price (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={draft.price}
                    onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                    className="w-full border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-800">Description</label>
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  className="w-full border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">Brand</label>
                  <input
                    value={draft.brand}
                    onChange={(e) => setDraft((d) => ({ ...d, brand: e.target.value }))}
                    className="w-full border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">Category</label>
                  <select
                    value={draft.category}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, category: e.target.value as ProductCategory }))
                    }
                    className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="clubs">Clubs</option>
                    <option value="balls">Balls</option>
                    <option value="apparel">Apparel</option>
                    <option value="accessories">Accessories</option>
                    <option value="shoes">Shoes</option>
                    <option value="bags">Bags</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-800">Image URL</label>
                <input
                  value={draft.image_url}
                  onChange={(e) => setDraft((d) => ({ ...d, image_url: e.target.value }))}
                  className="w-full border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="https://..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex items-center justify-between border border-gray-300 rounded-xl p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Featured Product</p>
                    <p className="text-xs text-gray-600">Show on homepage</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.is_featured}
                    onChange={(e) => setDraft((d) => ({ ...d, is_featured: e.target.checked }))}
                    className="w-5 h-5 accent-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between border border-gray-300 rounded-xl p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">In Stock</p>
                    <p className="text-xs text-gray-600">Available for sale</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.in_stock}
                    onChange={(e) => setDraft((d) => ({ ...d, in_stock: e.target.checked }))}
                    className="w-5 h-5 accent-emerald-600"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold"
              >
                {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
