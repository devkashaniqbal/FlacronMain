"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Check } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

type State = "idle" | "loading" | "success";

export default function ContactPage() {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Contact form:", form);
    setState("success");
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-flacron-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-colors";

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Contact Us" title="Let's start a conversation." description="Whether you have a question, want a demo, or are ready to start — we're here." centered />

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "hello@flacron.com" },
              { icon: Phone, label: "Phone", value: "+1 (555) 000-0000" },
              { icon: MapPin, label: "Headquarters", value: "Global — Remote First" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50">
                  <Icon className="h-5 w-5 text-[#F97316]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                  <p className="mt-0.5 text-sm font-medium text-flacron-navy">{value}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6">
              <p className="text-sm font-bold text-flacron-navy mb-2">Looking for a demo?</p>
              <p className="text-sm text-slate-500 mb-4">Book a personalised walkthrough of any Flacron product with our team.</p>
              <a href="/book-demo" className="text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                Book a Demo →
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {state === "success" ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 border border-green-200 mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-flacron-navy mb-2">Message sent!</h3>
                <p className="text-slate-500">{"We'll get back to you within 24 hours."}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-flacron-navy">Full Name *</label>
                    <input required name="name" value={form.name} onChange={handleChange} placeholder="John Smith" className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-flacron-navy">Email Address *</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@company.com" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-flacron-navy">Company</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="Your company name" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-flacron-navy">Subject *</label>
                  <select required name="subject" value={form.subject} onChange={handleChange} className={inputClass}>
                    <option value="">Select a topic...</option>
                    <option>Product Demo Request</option>
                    <option>Sales Inquiry</option>
                    <option>Partnership Opportunity</option>
                    <option>Technical Support</option>
                    <option>General Inquiry</option>
                    <option>Press / Media</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-flacron-navy">Message *</label>
                  <textarea required name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us how we can help..." className={inputClass + " resize-none"} />
                </div>
                <button type="submit" disabled={state === "loading"}
                  className="w-full rounded-xl bg-[#F97316] py-3.5 text-sm font-semibold text-white hover:bg-[#EA580C] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {state === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
