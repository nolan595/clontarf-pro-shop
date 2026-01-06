"use client";

import { BookingHero } from "./BookingHero";
import { BookingPanel } from "./BookingPanel";
import { BookingAltContact } from "./BookingAltContact";

export function BookLessonPage() {
  const bookingUrl = "https://eoinobrien.youcanbook.me/";

  return (
    <div className="min-h-screen">
      <BookingHero />

      <section className="py-8 md:py-16 bg-[#f8f6f1]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <BookingPanel bookingUrl={bookingUrl} />
          <BookingAltContact />
        </div>
      </section>
    </div>
  );
}
