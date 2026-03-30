import type { Metadata } from "next";
import type { AppDefinition } from "@/data/apps";

export function generateAppMetadata(app: AppDefinition): Metadata {
  const title = `${app.name} — ${app.tagline} | Flacron Enterprises`;
  return {
    title,
    description: app.seo.description,
    keywords: app.seo.keywords,
    openGraph: {
      title,
      description: app.seo.description,
      siteName: "Flacron Enterprises",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: app.seo.description,
    },
  };
}
