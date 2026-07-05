declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, data);
  window.dispatchEvent(new CustomEvent("flacron:track", { detail: { event, data } }));
}
