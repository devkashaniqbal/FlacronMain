"use client";

import dynamic from "next/dynamic";
import { Zap } from "lucide-react";

interface DynamicIconProps {
  iconName: string;
  className?: string;
}

export default function DynamicIcon({ iconName, className = "h-5 w-5" }: DynamicIconProps) {
  const Icon = dynamic(
    () =>
      import("lucide-react").then((mod) => {
        const allIcons = mod as unknown as Record<string, React.ComponentType<{ className?: string }>>;
        const component = allIcons[iconName];
        return { default: component || Zap };
      }),
    { loading: () => <Zap className={className} /> }
  );
  return <Icon className={className} />;
}
