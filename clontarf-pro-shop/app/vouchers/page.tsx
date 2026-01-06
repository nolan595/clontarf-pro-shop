import Link from "next/link";
import { routes } from "@/lib/routes";

export default function VouchersPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-3">Vouchers</h1>
        <p className="text-gray-600 mb-6">
          Coming soon. Your future customers are already reaching for their wallets.
        </p>
        <Link className="underline" href={routes.vouchers.replace("/vouchers", "/")}>
          Back home
        </Link>
      </div>
    </main>
  );
}
