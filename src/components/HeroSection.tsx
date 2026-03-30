"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,115,22,0.07)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.05)_0%,transparent_60%)]" />

      <motion.div variants={container} initial="hidden" animate="show"
        className="relative z-10 mx-auto max-w-5xl text-center">

        {/* Eyebrow */}
        <motion.div variants={item} className="mb-8 inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold text-[#F97316]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
            AI-Powered Technology Ecosystem
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1 variants={item}
          className="text-5xl font-black leading-[1.08] tracking-tight text-flacron-navy sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
          One Ecosystem.{" "}
          <span className="text-[#F97316]">Multiple</span>{" "}
          <br className="hidden sm:block" />
          AI-Powered{" "}
          <span className="text-[#F97316]">Solutions.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 leading-relaxed sm:text-xl">
          Discover Flacron Enterprises' ecosystem of intelligent applications for construction,
          insurance, lead generation, cybersecurity, sports, and personal growth.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/ecosystem"
            className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-8 py-4 text-base font-semibold text-white hover:bg-[#EA580C] transition-colors shadow-[0_4px_20px_rgba(249,115,22,0.3)]">
            Explore Ecosystem <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/book-demo"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-flacron-navy hover:border-[#F97316] hover:text-[#F97316] transition-colors">
            Book a Demo
          </Link>
        </motion.div>

        {/* Social proof strip */}
        <motion.div variants={item} className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          {["Microsoft Partner", "IBM Certified", "ISO 27001 Aligned", "Enterprise Ready"].map((badge) => (
            <span key={badge} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[#F97316]" />{badge}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="text-slate-300">
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
