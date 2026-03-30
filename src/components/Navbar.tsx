"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { apps } from "@/data/apps";
import AppLogo from "./AppLogo";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const pathname = usePathname();
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setMegaOpen(false); }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    }
    if (megaOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [megaOpen]);

  return (
    <header className={cn(
      "fixed inset-x-0 top-0 z-50 transition-all duration-300",
      scrolled ? "bg-white border-b border-slate-200 shadow-sm" : "bg-white"
    )}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-wider text-[#F97316]">FLACRON</span>
          <span className="hidden text-xs font-medium text-slate-400 sm:block">Enterprises</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link href={href} className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                pathname === href ? "text-flacron-navy bg-slate-100" : "text-slate-600 hover:text-flacron-navy hover:bg-slate-50"
              )}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Apps dropdown + CTAs */}
        <div className="hidden items-center gap-2 lg:flex" ref={megaRef}>
          <button
            onClick={() => setMegaOpen((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              megaOpen ? "bg-slate-100 text-flacron-navy" : "text-slate-600 hover:text-flacron-navy hover:bg-slate-50"
            )}
          >
            Apps
            <motion.span animate={{ rotate: megaOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>

          <Link href="/contact" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:text-flacron-navy hover:bg-slate-50 transition-colors">
            Contact
          </Link>
          <Link href="/book-demo" className="rounded-lg bg-[#F97316] px-4 py-2 text-sm font-semibold text-white hover:bg-[#EA580C] transition-colors shadow-sm">
            Book a Demo
          </Link>

          {/* Mega menu */}
          <AnimatePresence>
            {megaOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-x-0 top-16 border-b border-slate-200 bg-white shadow-xl"
              >
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Our Products</p>
                    <Link href="/ecosystem" className="flex items-center gap-1 text-xs font-medium text-[#F97316] hover:text-[#EA580C]" onClick={() => setMegaOpen(false)}>
                      View all <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-3">
                    {apps.map((app) => (
                      <Link key={app.id} href={`/apps/${app.slug}`} onClick={() => setMegaOpen(false)}
                        className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50">
                        <AppLogo name={app.name} size={36} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-flacron-navy truncate">{app.name}</span>
                            <StatusBadge status={app.status} />
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{app.tagline}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col overflow-y-auto bg-white border-t border-slate-100 lg:hidden"
          >
            <div className="px-4 py-6 space-y-1">
              {[...navLinks, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
                <Link key={label} href={href}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-flacron-navy"
                  onClick={() => setMobileOpen(false)}>
                  {label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Products</p>
                {apps.map((app) => (
                  <Link key={app.id} href={`/apps/${app.slug}`}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-50"
                    onClick={() => setMobileOpen(false)}>
                    <AppLogo name={app.name} size={32} />
                    <div>
                      <p className="text-sm font-semibold text-flacron-navy">{app.name}</p>
                      <p className="text-xs text-slate-500">{app.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pt-4 pb-8">
                <Link href="/book-demo"
                  className="block w-full rounded-xl bg-[#F97316] px-6 py-3 text-center font-semibold text-white hover:bg-[#EA580C] transition-colors"
                  onClick={() => setMobileOpen(false)}>
                  Book a Demo
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
