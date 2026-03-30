"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { AppDefinition } from "@/data/apps";
import GlassCard from "./GlassCard";
import AppLogo from "./AppLogo";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

type Category = AppDefinition["category"];
type Status = AppDefinition["status"];

const ALL_CATEGORIES: Category[] = ["Construction", "Business", "Finance", "Growth", "Security", "Sports", "Insurance"];
const ALL_STATUSES: Status[] = ["live", "beta", "coming-soon"];
const statusLabel: Record<Status, string> = { live: "Live", beta: "Beta", "coming-soon": "Coming Soon", internal: "Internal" };

interface AppGridProps {
  apps: AppDefinition[];
  mode?: "full" | "preview";
}

export default function AppGrid({ apps, mode = "full" }: AppGridProps) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);

  const displayedApps = useMemo(() => {
    if (mode === "preview") return apps.slice(0, 4);
    return apps.filter((app) => {
      const catOk = selectedCategories.length === 0 || selectedCategories.includes(app.category);
      const statusOk = selectedStatuses.length === 0 || selectedStatuses.includes(app.status);
      return catOk && statusOk;
    });
  }, [apps, mode, selectedCategories, selectedStatuses]);

  const toggleCategory = (c: Category) =>
    setSelectedCategories((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);
  const toggleStatus = (s: Status) =>
    setSelectedStatuses((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  const hasFilters = selectedCategories.length > 0 || selectedStatuses.length > 0;

  return (
    <div>
      {mode === "full" && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const active = selectedCategories.includes(cat);
            return (
              <button key={cat} onClick={() => toggleCategory(cat)}
                className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors border",
                  active ? "bg-[#F97316] text-white border-[#F97316]" : "bg-white text-slate-600 border-slate-200 hover:border-[#F97316] hover:text-[#F97316]")}>
                {cat}
              </button>
            );
          })}
          <div className="hidden h-4 w-px bg-slate-200 sm:block" />
          {ALL_STATUSES.map((s) => {
            const active = selectedStatuses.includes(s);
            return (
              <button key={s} onClick={() => toggleStatus(s)}
                className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors border",
                  active ? "bg-[#F97316] text-white border-[#F97316]" : "bg-white text-slate-600 border-slate-200 hover:border-[#F97316] hover:text-[#F97316]")}>
                {statusLabel[s]}
              </button>
            );
          })}
          {hasFilters && (
            <button onClick={() => { setSelectedCategories([]); setSelectedStatuses([]); }}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors border border-transparent hover:border-slate-200">
              Clear filters ×
            </button>
          )}
        </div>
      )}

      <div className={cn("grid gap-5",
        mode === "preview"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
        <AnimatePresence mode="popLayout">
          {displayedApps.map((app, index) => {
            const isFeatured = index === 0 && mode === "full" && app.status === "live";
            return (
              <motion.div key={app.id} layout
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2 }}
                className={cn(isFeatured && "sm:col-span-2 lg:col-span-1")}>
                <GlassCard priority={isFeatured ? "featured" : "default"} className="h-full flex flex-col p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <AppLogo name={app.name} size={44} />
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-flacron-navy">{app.name}</h3>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{app.category}</p>
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-3">{app.shortDescription}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {app.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-xs text-slate-500">{tech}</span>
                    ))}
                    {app.techStack.length > 3 && (
                      <span className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-xs text-slate-400">+{app.techStack.length - 3}</span>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link href={`/apps/${app.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                      Learn More <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {displayedApps.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center text-slate-400">
            No apps match the selected filters.
          </motion.div>
        )}
      </div>
    </div>
  );
}
