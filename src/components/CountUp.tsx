"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface CountUpProps {
  value: string;
  className?: string;
}

function parseValue(raw: string) {
  const match = raw.match(/^([^\d.]*)([\d.]+)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: raw, decimals: 0 };
  const [, prefix, numStr, suffix] = match;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { prefix, number: parseFloat(numStr), suffix, decimals };
}

export default function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState("0");
  const { prefix, number, suffix, decimals } = parseValue(value);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, number, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, number, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
