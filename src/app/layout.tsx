import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Flacron Enterprises — AI-Powered Technology Ecosystem",
  description:
    "Flacron Enterprises is an AI-powered technology ecosystem building smart solutions for business growth, automation, industry operations, and digital transformation.",
};

const footerLinks = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Partners", href: "/partners" },
    { label: "Contact", href: "/contact" },
    { label: "Book a Demo", href: "/book-demo" },
  ],
  Products: [
    { label: "FlacronBuild", href: "/apps/flacronbuild" },
    { label: "FlacronConnect AI", href: "/apps/flacronconnect-ai" },
    { label: "RapidClaimPro", href: "/apps/rapidclaimpro" },
    { label: "FlacronSport", href: "/apps/flacronsport" },
    { label: "Being Tchitaka", href: "/apps/beingtchitaka" },
    { label: "FlacronSecure AI", href: "/apps/flacronsecure-ai" },
  ],
  Explore: [
    { label: "Ecosystem", href: "/ecosystem" },
    { label: "Solutions", href: "/solutions" },
    { label: "Industries", href: "/industries" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-flacron-navy antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>

        <footer className="bg-flacron-navy text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            {/* Top */}
            <div className="flex flex-col gap-12 lg:flex-row">
              {/* Brand */}
              <div className="lg:w-64 shrink-0">
                <Link href="/">
                  <span className="text-2xl font-black tracking-wider text-[#F97316]">FLACRON</span>
                  <span className="ml-2 text-sm font-medium text-slate-400">Enterprises</span>
                </Link>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  An AI-powered technology ecosystem building intelligent solutions for business growth, automation, and digital transformation.
                </p>
                <div className="mt-6 flex gap-3">
                  {["LinkedIn", "Twitter", "GitHub"].map((s) => (
                    <span key={s} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:border-white/30 transition-colors cursor-pointer">{s}</span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex-1 grid grid-cols-2 gap-8 sm:grid-cols-4">
                {Object.entries(footerLinks).map(([group, links]) => (
                  <div key={group}>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{group}</p>
                    <ul className="space-y-2.5">
                      {links.map(({ label, href }) => (
                        <li key={label}>
                          <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors">{label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-12 border-t border-white/10 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-slate-500">© 2025 Flacron Enterprises. All rights reserved.</p>
              <p className="text-xs text-slate-600">Microsoft Partner · IBM Certified · ISO 27001 Aligned</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
