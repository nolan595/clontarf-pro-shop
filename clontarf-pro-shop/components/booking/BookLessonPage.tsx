"use client";

import { BookingHero } from "./BookingHero";
import { BookingPanel } from "./BookingPanel";
import { BookingAltContact } from "./BookingAltContact";

export function BookLessonPage() {
  const bookingUrl = "https://eoinobrien.youcanbook.me/";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <BookingHero />

      <section className="py-10 md:py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <BookingPanel bookingUrl={bookingUrl} />
          <BookingAltContact />
        </div>
      </section>
    </div>
  );
}
