// lib/sumup.ts
const SUMUP_API_BASE = "https://api.sumup.com";

function getApiKey() {
  const key = process.env.SUM_UP_API_KEY || process.env.SUMUP_API_KEY;
  if (!key) throw new Error("Missing SUM_UP_API_KEY / SUMUP_API_KEY");
  return key;
}

export async function sumupFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${SUMUP_API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return res;
}

export async function createCheckout(payload: {
  checkout_reference: string;
  amount: number; // decimal e.g. 225.00
  currency: string;
  merchant_code?: string;
  description?: string;
  return_url?: string;
}) {
  const res = await sumupFetch("/v0.1/checkouts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SumUp createCheckout failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<{
    id: string;
    checkout_reference: string;
    hosted_checkout_url?: string;
    status?: string;
  }>;
}

export async function getCheckout(checkoutId: string) {
  const res = await sumupFetch(`/v0.1/checkouts/${checkoutId}`, { method: "GET" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SumUp getCheckout failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<{
    id: string;
    status: string; // depends on SumUp, we’ll map loosely
    amount: number;
    currency: string;
  }>;
}
