import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { apps } from "@/data/apps";

export const metadata: Metadata = {
  title: "About — Flacron Enterprises",
  description: "Learn about Flacron Enterprises — our mission, vision, and the team building the next generation of AI-powered business solutions.",
};

const values = [
  { title: "Industry First", desc: "We build products that solve real, specific industry problems — not generic tools dressed up as AI." },
  { title: "Ecosystem Thinking", desc: "Our products are designed to work together. Each new solution strengthens the whole platform." },
  { title: "Accessible AI", desc: "Enterprise-grade AI shouldn't require a huge team to use. We make powerful technology usable." },
  { title: "Long-Term Partnership", desc: "We build for the long run. Our clients grow their businesses with us, not just our software." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#F97316]">About Us</p>
          <h1 className="text-5xl font-black leading-tight text-flacron-navy sm:text-6xl" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
            One company. One ecosystem.<br />
            <span className="text-[#F97316]">Many solutions.</span>
          </h1>
          <p className="mt-6 text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Flacron Enterprises is an AI-powered technology company building intelligent solutions for business growth, automation, industry operations, and digital transformation.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <SectionHeader eyebrow="Our Mission" title="Technology that serves real people." />
              <p className="text-slate-500 leading-relaxed">
                We started Flacron Enterprises with a single belief: the best software is built around the people who use it, not the other way around. Too many businesses are forced to adapt their workflows to fit rigid software. We build the other way — starting with the problems industries actually face and working backwards to the technology.
              </p>
              <p className="mt-4 text-slate-500 leading-relaxed">
                Today, our ecosystem spans construction, insurance, cybersecurity, business growth, sports engagement, and personal development. Tomorrow, it will grow further. Every product we build shares the same foundation: AI-powered intelligence, enterprise reliability, and genuine user value.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { value: `${apps.length}`, label: "AI Products" },
                { value: "6+", label: "Industries Served" },
                { value: "2", label: "Global Technology Partners" },
                { value: "∞", label: "Ambition" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <p className="text-4xl font-black text-[#F97316]" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>{s.value}</p>
                  <p className="mt-2 text-sm font-medium text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-flacron-navy">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Our Vision" title="The ecosystem of the future." light centered />
          <p className="text-center text-slate-300 max-w-2xl mx-auto -mt-6 mb-12">
            We envision a world where every business — regardless of size or industry — has access to the same quality of AI-powered tools that only the largest enterprises could previously afford.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeader eyebrow="Join Us" title="Be part of the ecosystem." centered />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/ecosystem" className="rounded-xl bg-[#F97316] px-8 py-4 text-base font-semibold text-white hover:bg-[#EA580C] transition-colors shadow-sm">
              Explore Products
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 px-8 py-4 text-base font-semibold text-flacron-navy hover:border-[#F97316] hover:text-[#F97316] transition-colors">
              Get In Touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
