import Link from "next/link";
import { routes } from "@/lib/routes";

export default function BookLessonPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-3">Book a Lesson</h1>
        <p className="text-gray-600 mb-6">
          Coming soon. PGA pros are warming up their “nice swing” compliments.
        </p>
        <Link className="underline" href={routes.vouchers.replace("/vouchers", "/")}>
          Back home
        </Link>
      </div>
    </main>
  );
}
