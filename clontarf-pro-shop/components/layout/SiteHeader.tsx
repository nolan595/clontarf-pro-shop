"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { routes } from "@/lib/routes";
import Image from "next/image";


type NavLink = {
  name: string;
  href: string;
  match: (pathname: string) => boolean;
};

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks: NavLink[] = useMemo(
    () => [
      {
        name: "Home",
        href: routes.home,
        match: (p) => p === routes.home,
      },
      {
  name: "Products",
  href: routes.products,
  match: (p) => p.startsWith(routes.products),
},
      {
        name: "Vouchers",
        href: routes.vouchers,
        match: (p) => p.startsWith(routes.vouchers),
      },
      {
        name: "Book a Lesson",
        href: routes.bookLesson,
        match: (p) => p.startsWith(routes.bookLesson),
      },
    ],
    []
  );

  const isActive = (link: NavLink) => link.match(pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a4d2e]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
<Link
  href={routes.home}
  className="flex items-center gap-3"
  onClick={() => setMobileMenuOpen(false)}
>
  <div className="w-10 h-10 rounded-full bg-[#c9a962] flex items-center justify-center overflow-hidden">
    <Image
      src="/images/clontarfGolfLogo.png"
      alt="Clontarf Golf Pro Shop logo"
      width={24}
      height={24}
      className="object-contain"
      priority
    />
  </div>

  <span className="text-xl font-semibold text-white tracking-tight">
    Clontarf Paradise Golf
  </span>
</Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isActive(link)
                    ? "text-[#c9a962]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 text-white"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1a4d2e] border-t border-white/10 overflow-hidden"
          >
            <nav className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 text-base font-medium transition-colors ${
                    isActive(link) ? "text-[#c9a962]" : "text-white/80"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
