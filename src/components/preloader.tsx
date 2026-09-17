import { useEffect, useState } from "react";
import { BrandLogo } from "./brand-logo";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousBehavior = html.style.scrollBehavior;
    const previousOverflow = body.style.overflow;

    // Always start the experience at the top of the hero.
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    html.style.scrollBehavior = "auto";
    body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const exitTimer = window.setTimeout(() => {
      window.scrollTo(0, 0);
      setLeaving(true);
    }, 4300);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      body.style.overflow = previousOverflow;
      window.scrollTo(0, 0);
      html.style.scrollBehavior = previousBehavior;
    }, 5000);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
      body.style.overflow = previousOverflow;
      html.style.scrollBehavior = previousBehavior;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-luxury transition-[opacity,transform] duration-700 ${leaving ? "pointer-events-none scale-[1.015] opacity-0" : "opacity-100"}`}>
      <div className="absolute inset-x-0 top-1/2 h-px origin-left animate-preloader-line bg-primary-foreground/20" />
      <div className="relative bg-luxury px-8 py-6">
        <BrandLogo inverse className="h-14 animate-logo-reveal sm:h-16" />
        <div className="mx-auto mt-5 h-px w-24 overflow-hidden bg-primary-foreground/15">
          <span className="block h-full origin-left animate-preloader-progress bg-metal" />
        </div>
      </div>
      <span className="absolute bottom-8 text-[9px] font-bold uppercase tracking-[.4em] text-primary-foreground/50">Protección con criterio</span>
    </div>
  );
}
