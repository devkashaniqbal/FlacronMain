"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  priority?: "default" | "featured";
}

export default function GlassCard({ children, className, priority = "default" }: GlassCardProps) {
  const isFeatured = priority === "featured";
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative rounded-2xl border bg-white transition-all duration-300",
        isFeatured
          ? "border-[#F97316]/30 shadow-[0_8px_40px_rgba(249,115,22,0.12)]"
          : "border-slate-200 shadow-sm hover:border-[#F97316]/30 hover:shadow-[0_8px_32px_rgba(249,115,22,0.1)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
