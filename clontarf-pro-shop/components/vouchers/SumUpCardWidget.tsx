"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

type SumUpCardResponse = {
  status?: string;
  event?: string;
  type?: string;
  [key: string]: unknown; // allow future fields safely
};

declare global {
  interface Window {
    SumUpCard?: {
      mount: (opts: {
        id: string;
        checkoutId: string;
        onResponse: (r: SumUpCardResponse) => void;
      }) => void;
    };
  }
}


async function postJSON<TResponse>(
  url: string,
  body: unknown
): Promise<TResponse> {
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

async function getJSON<TResponse>(url: string): Promise<TResponse> {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json() as Promise<TResponse>;
}


export default function SumUpCardWidget({
  voucherPurchaseId,
  onPaid,
}: {
  voucherPurchaseId: string;
  onPaid: () => void;
}) {
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [hostedUrl, setHostedUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const mountedRef = useRef(false);

  const containerId = useMemo(
    () => `sumup-card-${voucherPurchaseId}`,
    [voucherPurchaseId]
  );

  // Create/reuse checkout when modal opens (component mounts)
  useEffect(() => {
    let cancelled = false;
    (async () => {
const data = await postJSON<{
  checkoutId: string;
  hostedUrl?: string | null;
}>("/api/sumup/checkout", { voucherPurchaseId });
      if (cancelled) return;
      setCheckoutId(data.checkoutId);
      setHostedUrl(data.hostedUrl ?? null);
    })().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [voucherPurchaseId]);

  // Mount widget once SDK + checkoutId are ready
  useEffect(() => {
    if (!checkoutId) return;
    if (!window.SumUpCard) return;
    if (mountedRef.current) return;

    mountedRef.current = true;

    window.SumUpCard.mount({
      id: containerId,
      checkoutId,
onResponse: async (r: SumUpCardResponse) => {
        // use callback for UX, confirm server-side for truth
        const looksSuccessful =
          r?.status === "SUCCESSFUL" ||
          r?.event === "payment-success" ||
          r?.type === "payment-success";

        if (!looksSuccessful) return;

        setBusy(true);
        await postJSON("/api/voucher-purchases/confirm", { checkoutId });
        onPaid();
      },
    });
  }, [checkoutId, containerId, onPaid]);

  // Lightweight fallback: only if callback doesn’t fire
  useEffect(() => {
    if (!checkoutId) return;

    let cancelled = false;
    let attempts = 0;

    const tick = async () => {
      attempts += 1;
      if (cancelled) return;
      if (attempts > 12) return; // ~1 min max, then stop

      try {
        const status = await getJSON<{ status?: string }>(
  `/api/sumup/checkouts/${checkoutId}`
);

        const s = String(status.status || "").toUpperCase();
        if (s === "PAID" || s === "SUCCESSFUL" || s === "CAPTURED") {
          await postJSON("/api/voucher-purchases/confirm", { checkoutId });
          onPaid();
          return;
        }
      } catch {}

      setTimeout(tick, attempts <= 4 ? 2000 : 5000); // fast early, then slow
    };

    const t = setTimeout(tick, 2500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [checkoutId, onPaid]);

  return (
    <div className="rounded-xl border p-4">
      {/* Loads ONLY when modal opens (because component exists only then) */}
      <Script
        src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js"
        strategy="afterInteractive"
      />

      <div className="text-sm mb-3 opacity-80">
        {busy ? "Processing payment…" : "Enter your card details"}
      </div>

      <div id={containerId} className="min-h-[220px]" />

      {hostedUrl && (
        <button
          type="button"
          className="mt-3 w-full rounded-lg border px-3 py-2 text-sm hover:bg-black/5"
          onClick={() => window.open(hostedUrl, "_blank")}
          disabled={busy}
        >
          Having trouble? Open secure checkout
        </button>
      )}
    </div>
  );
}
