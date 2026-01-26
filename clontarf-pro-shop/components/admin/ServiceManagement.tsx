"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Plus, ShoppingBag, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { CldUploadWidget, CloudinaryUploadWidgetResults, CldImage } from 'next-cloudinary';

export type Service = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    cloudinary_public_id: string | null;
};

type Props = {
    initialServices: Service[];
    onChanged?: () => void;
}

type ServiceDraft = {
    name: string;
    description: string;
    price: string;
    cloudinary_public_id: string;
}

const EMPTY_DRAFT: ServiceDraft = {
  name: "",
  description: "",
  price: "",
  cloudinary_public_id: ""
}

export default function ServiceManagement({ initialServices, onChanged }: Props) {
    const [services, setServices] = useState<Service[]>(initialServices);

    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<Service | null>(null);
    const [draft, setDraft] = useState<ServiceDraft>(EMPTY_DRAFT);
    const [saving, setSaving] = useState(false);

    React.useEffect(() => setServices(initialServices), [initialServices]);

    function openCreate() {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
    setIsOpen(true);
  }

    function openEdit(p: Service) {
    setEditing(p);
    setDraft({
      name: p.name ?? "",
      description: p.description ?? "",
      price: String(p.price ?? ""),
      cloudinary_public_id: p.cloudinary_public_id ?? "",
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
      toast.error("Please fill in service name and price.");
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
        cloudinary_public_id: draft.cloudinary_public_id.trim() ? draft.cloudinary_public_id.trim() : null,
      };

      if (editing) {
        const updated = await api<Service>(`/api/services/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        setServices((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
        toast.success("Service updated");
      } else {
        const created = await api<Service>(`/api/services`, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        // prepend so it appears quickly even before server refresh
        setServices((prev) => [created, ...prev]);
        toast.success("Service created");
      }

      closeModal();
      onChanged?.();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Something went wrong"));
    } finally {
      setSaving(false);
    }
  }

    async function deleteService(p: Service) {
    const ok = confirm(`Delete "${p.name}"?`);
    if (!ok) return;

    // optimistic remove
    const prev = services;
    setServices((curr) => curr.filter((x) => x.id !== p.id));

    try {
      await api<{ ok: true }>(`/api/services/${p.id}`, { method: "DELETE" });
      toast.success("Service deleted");
      onChanged?.();
    } catch (err: unknown) {
      setServices(prev);
      toast.error(getErrorMessage(err, "Failed to delete service"));
    }
  }

    return (
    <div className="bg-white rounded-2xl border border-black/10 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
      <div className="p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111]">Service Management</h2>
          <p className="text-sm text-gray-500">
            {services.length} services
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="px-6 pb-6">
        {services.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-14 h-14 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No services yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {services.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                    {p.cloudinary_public_id ? (
                      <CldImage
                        src={p.cloudinary_public_id}
                        alt={p.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        sizes="64px"
                        crop="fill"
                        gravity="auto"
                        format="auto"
                        quality="auto"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-400" />
                      </div>
                    )}

                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#222] truncate">{p.name}</h4>

                  </div>

                  <div className="flex items-center gap-3">

                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-blue-600"
                      title="Edit Service"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>

                    

                    <button
                      onClick={() => deleteService(p)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                      title="Delete Service"
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
                {editing ? "Edit Service" : "Add Service"}
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
                  <label className="text-sm font-medium text-gray-800">Service Name *</label>
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

                <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-800">Service Image</label>

                    {/* Status pill */}
                    {draft.cloudinary_public_id ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Image attached
                    </span>
                    ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 border border-gray-200">
                        <span className="h-2 w-2 rounded-full bg-gray-300" />
                        No image
                    </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <CldUploadWidget
                    signatureEndpoint="/api/sign-image"
                    options={{ maxFiles: 1, multiple: false }}
                    onSuccess={(result: CloudinaryUploadWidgetResults) => {
                        if (result.event !== "success") return;

                        const info = result.info;
                        if (!info || typeof info === "string") {
                        toast.error("Upload failed");
                        return;
                        }

                        const publicId = info.public_id;
                        if (!publicId) {
                        toast.error("Upload failed");
                        return;
                        }

                        setDraft((d) => ({ ...d, cloudinary_public_id: publicId }));
                        toast.success("Image uploaded");
                    }}
                    >
                    {({ open }) => (
                        <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            open();
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        >
                        {draft.cloudinary_public_id ? "Replace image" : "Upload image"}
                        </button>
                    )}
                    </CldUploadWidget>

                    <button
                    type="button"
                    disabled={!draft.cloudinary_public_id}
                    onClick={() => setDraft((d) => ({ ...d, cloudinary_public_id: "" }))}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                    Remove
                    </button>

                            {/* Optional: show a shortened id so user knows something is there */}
                            {draft.cloudinary_public_id ? (
                            <span className="ml-auto hidden md:inline text-xs text-gray-500 truncate max-w-[260px]">
                                {draft.cloudinary_public_id}
                            </span>
                            ) : null}
                        </div>
                        </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold"
              >
                {saving ? "Saving..." : editing ? "Update Service" : "Add Service"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

}