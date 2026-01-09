// app/products/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="h-10 w-64 mx-auto bg-white/10 rounded animate-pulse" />
          <div className="h-5 w-96 mx-auto mt-4 bg-white/10 rounded animate-pulse" />
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-10 w-64 bg-white/10 rounded animate-pulse mb-8" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="h-64 bg-black/10 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-24 bg-black/10 rounded animate-pulse" />
                  <div className="h-5 w-2/3 bg-black/10 rounded animate-pulse" />
                  <div className="h-4 w-full bg-black/10 rounded animate-pulse" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-7 w-24 bg-black/10 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-black/10 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
