"use client";

import { CalendarClock } from "lucide-react";

const CAL_LINK = process.env.NEXT_PUBLIC_BOOKING_LINK;

function buildEmbedUrl(link: string): string {
  if (link.includes("calendly.com")) {
    const sep = link.includes("?") ? "&" : "?";
    return `${link}${sep}embed_domain=flacron.com&embed_type=Inline&hide_event_type_details=1`;
  }
  if (link.includes("cal.com")) {
    const sep = link.includes("?") ? "&" : "?";
    return `${link}${sep}embed=true`;
  }
  return link;
}

export default function CalendarEmbed() {
  if (!CAL_LINK) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <CalendarClock className="h-8 w-8 text-slate-400" />
        <p className="text-sm font-semibold text-flacron-navy">Instant calendar booking is almost here.</p>
        <p className="max-w-sm text-sm text-slate-500">
          For now, fill out the form below and our team will personally reach out within 24 hours to find a time that works.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <iframe
        src={buildEmbedUrl(CAL_LINK)}
        className="h-[680px] w-full"
        title="Book a time with Flacron"
        loading="lazy"
      />
    </div>
  );
}
