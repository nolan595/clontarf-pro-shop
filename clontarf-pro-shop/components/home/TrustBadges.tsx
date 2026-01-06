import { trustBadges } from "./homeData";

export function TrustBadges() {
  return (
    <section className="py-16 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-8">
          {trustBadges.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="flex flex-col items-center text-center">
                <Icon className="w-6 h-6 text-[#1a4d2e] mb-2" />
                <span className="text-sm text-gray-600">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
