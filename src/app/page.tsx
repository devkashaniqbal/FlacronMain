import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { apps } from "@/data/apps";
import HeroSection from "@/components/HeroSection";
import AppGrid from "@/components/AppGrid";
import SectionHeader from "@/components/SectionHeader";
import GlassCard from "@/components/GlassCard";
import AppLogo from "@/components/AppLogo";
import StatusBadge from "@/components/StatusBadge";

const liveApps = apps.filter((a) => a.status === "live");
const featuredApps = apps.slice(0, 4);

const industries = [
  { name: "Construction", icon: "🏗️", desc: "AI estimation, project management, and compliance." },
  { name: "Insurance", icon: "🛡️", desc: "Claims automation, fraud detection, and self-service." },
  { name: "Small Business", icon: "💼", desc: "Lead generation, CRM, and automated outreach." },
  { name: "Cybersecurity", icon: "🔒", desc: "Threat detection, compliance, and breach monitoring." },
  { name: "Sports & Media", icon: "⚽", desc: "Fan engagement, content AI, and athlete branding." },
  { name: "Personal Growth", icon: "🌱", desc: "Coaching, habit intelligence, and community." },
];

const differentiators = [
  { title: "Ecosystem Approach", desc: "All our products share infrastructure, integrations, and support — so your tools work better together." },
  { title: "AI-First Architecture", desc: "Every product is built with AI at the core, not bolted on as an afterthought." },
  { title: "Scalable Solutions", desc: "From solo founders to enterprise teams — our platforms grow as you grow." },
  { title: "Industry-Focused", desc: "Each product is purpose-built for its industry's specific workflows and regulations." },
  { title: "Partner-Backed Innovation", desc: "Built on Microsoft and IBM technology with enterprise-grade security and reliability." },
  { title: "Future-Ready Platform", desc: "New products are constantly being added. One relationship, expanding capability." },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Trusted By */}
      <section className="border-y border-slate-100 bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Trusted Technologies & Partnerships
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {["Microsoft Partner", "IBM Certified", "AWS Infrastructure", "Azure AI", "ISO 27001 Aligned"].map((p) => (
              <span key={p} className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Overview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-4">
            <SectionHeader
              eyebrow="Our Ecosystem"
              title="Built for every frontier."
              description="Explore our suite of AI-powered products — each solving real problems in its industry."
            />
            <Link href="/ecosystem"
              className="shrink-0 self-start sm:self-auto mb-12 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:border-[#F97316] hover:text-[#F97316] transition-colors">
              View All Apps <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <AppGrid apps={featuredApps} mode="preview" />
        </div>
      </section>

      {/* Featured / Live Solutions */}
      <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Available Now"
            title="Solutions ready to deploy."
            description="These products are live and helping teams right now."
            centered
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {liveApps.map((app) => (
              <GlassCard key={app.id} className="p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <AppLogo name={app.name} size={44} />
                  <StatusBadge status={app.status} />
                </div>
                <h3 className="text-base font-bold text-flacron-navy">{app.name}</h3>
                <p className="mt-2 text-sm text-slate-500 flex-1 leading-relaxed">{app.shortDescription}</p>
                {app.metrics && (
                  <div className="mt-4 rounded-xl bg-orange-50 border border-orange-100 px-4 py-3">
                    <p className="text-lg font-black text-[#F97316]">{app.metrics.value}</p>
                    <p className="text-xs text-orange-600 font-medium">{app.metrics.label}</p>
                  </div>
                )}
                <Link href={`/apps/${app.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                  Get Started <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Industries We Serve"
            title="Your industry, intelligently served."
            description="Flacron Enterprises builds focused solutions for the industries where AI can make the biggest difference."
            centered
          />
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {industries.map((ind) => (
              <Link href="/industries" key={ind.name}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-center hover:border-[#F97316]/40 hover:shadow-md transition-all">
                <span className="text-3xl">{ind.icon}</span>
                <p className="mt-3 text-sm font-bold text-flacron-navy">{ind.name}</p>
                <p className="mt-1 text-xs text-slate-400 leading-snug hidden sm:block">{ind.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Flacron — dark section */}
      <section className="bg-flacron-navy py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Why Flacron"
            title="One company. One vision. Many solutions."
            description="We don't build disconnected tools. We build a connected ecosystem that grows with you."
            centered
            light
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((d) => (
              <div key={d.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <CheckCircle className="mb-3 h-6 w-6 text-[#F97316]" />
                <h3 className="text-base font-bold text-white">{d.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Coming Soon teaser */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-orange-50 border-y border-orange-100">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#F97316] mb-3">Ecosystem Expanding</p>
          <h2 className="text-2xl font-black text-flacron-navy sm:text-3xl" style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
            More solutions are coming.
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            We are actively building new AI products. Follow our progress and be first to hear about new launches.
          </p>
          <Link href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#EA580C] transition-colors shadow-sm">
            Stay Updated <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeader
            eyebrow="Get Started"
            title="Ready to transform your business?"
            description="Talk to our team, explore the ecosystem, or book a personalised demo today."
            centered
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/ecosystem"
              className="rounded-xl bg-[#F97316] px-8 py-4 text-base font-semibold text-white hover:bg-[#EA580C] transition-colors shadow-[0_4px_20px_rgba(249,115,22,0.25)]">
              Explore Ecosystem
            </Link>
            <Link href="/book-demo"
              className="rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-flacron-navy hover:border-[#F97316] hover:text-[#F97316] transition-colors">
              Book a Demo
            </Link>
            <Link href="/contact"
              className="rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-flacron-navy hover:border-[#F97316] hover:text-[#F97316] transition-colors">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
