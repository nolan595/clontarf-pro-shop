import Image from "next/image";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1a4d2e] text-white/70 py-12 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c9a962] flex items-center justify-center overflow-hidden">
              <Image
                src="/images/clontarfGolfLogo.png"
                alt="Clontarf Golf Pro Shop logo"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold text-white">Clontarf Paradise Golf</span>
          </div>

          <p className="text-sm">© {year} Clontarf Paradise Golf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
