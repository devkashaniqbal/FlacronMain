import type { Metadata } from "next";
import { apps } from "@/data/apps";
import AppGrid from "@/components/AppGrid";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Ecosystem — Flacron Enterprises",
  description: "Explore the full Flacron Enterprises ecosystem of AI-powered products. Filter by industry, category, and status.",
};

export default function EcosystemPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <div className="mb-16 text-center">
          <SectionHeader
            eyebrow="Full Ecosystem"
            title="Every product. One mission."
            description="Browse the complete suite of Flacron Enterprises AI products. New solutions are added continuously — this is where you find them all."
            centered
          />
        </div>

        {/* Stats */}
        <div className="mb-12 flex flex-wrap justify-center gap-8">
          {[
            { value: `${apps.length}`, label: "Products" },
            { value: `${apps.filter(a => a.status === "live").length}`, label: "Live Now" },
            { value: `${apps.filter(a => a.status === "coming-soon" || a.status === "beta").length}`, label: "In Development" },
            { value: "6+", label: "Industries" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-[#F97316]" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>{s.value}</p>
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        <AppGrid apps={apps} mode="full" />

        {/* More coming */}
        <div className="mt-20 rounded-2xl bg-orange-50 border border-orange-100 p-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#F97316] mb-2">Growing Ecosystem</p>
          <h3 className="text-2xl font-black text-flacron-navy" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
            More solutions are on the way.
          </h3>
          <p className="mt-3 text-slate-500 max-w-lg mx-auto text-sm">
            We are continuously building and launching new AI-powered products. Want to be first to know?
          </p>
          <a href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-6 py-3 text-sm font-semibold text-white hover:bg-[#EA580C] transition-colors">
            Stay in the Loop
          </a>
        </div>
      </div>
    </div>
  );
}
