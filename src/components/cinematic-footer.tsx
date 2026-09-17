import { useEffect, useRef } from "react";
import { ArrowUpRight, Heart, Mail, Phone } from "lucide-react";
import { BrandLogo } from "./brand-logo";

export function CinematicFooter() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    let cleanup = () => {};
    void import("gsap").then(({ gsap }) => import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (!root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => { gsap.from("[data-footer-reveal]", { y: 70, opacity: 0, stagger: .12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 78%" } }); }, root);
      cleanup = () => ctx.revert();
    }));
    return () => cleanup();
  }, []);
  return <footer ref={root} id="contacto" className="relative overflow-hidden bg-luxury px-5 pb-8 pt-28 text-primary-foreground sm:px-8 lg:pt-36">
    <div className="pointer-events-none absolute inset-x-0 top-4 whitespace-nowrap text-center font-display text-[18vw] font-bold leading-none text-primary-foreground/[.035]">SABAS MARIN</div>
    <div className="relative mx-auto max-w-[90rem]"><div data-footer-reveal className="max-w-5xl"><p className="text-[10px] font-bold uppercase text-metal">La protección correcta comienza con una conversación</p><h2 className="mt-6 text-4xl font-semibold leading-[1.04] sm:text-7xl lg:text-8xl">Convirtamos la incertidumbre en respaldo.</h2></div>
      <div className="mt-14 grid gap-10 border-y border-primary-foreground/15 py-10 md:grid-cols-3">
        <div data-footer-reveal><BrandLogo inverse className="h-14" /><p className="mt-5 max-w-xs text-sm leading-6 text-primary-foreground/65">Intermediación técnica, ética y transparente para proteger personas, familias y empresas.</p></div>
        <div data-footer-reveal className="space-y-4"><p className="text-xs font-bold uppercase text-metal">Cotizaciones</p><a className="flex items-center gap-3" href="tel:+584122715331"><Phone className="size-4" /> 0412-2715331</a><a className="flex items-center gap-3 break-all" href="mailto:atencionalcliente@sabasmarin.com"><Mail className="size-4" /> atencionalcliente@sabasmarin.com</a></div>
        <div data-footer-reveal className="space-y-4"><p className="text-xs font-bold uppercase text-metal">Atención gerencial</p><a className="flex items-center gap-3" href="tel:+584148697158"><Phone className="size-4" /> 0414-8697158</a><a className="flex items-center gap-3 break-all" href="mailto:gerencia@sabasmarin.com"><Mail className="size-4" /> gerencia@sabasmarin.com</a><a href="/cotizar" className="inline-flex items-center gap-2 border-b border-metal pb-1 font-semibold">Solicitar cotización <ArrowUpRight /></a></div>
      </div>
      <div className="mt-6 flex flex-col gap-3 text-xs text-primary-foreground/50 sm:flex-row sm:justify-between"><span>Registro Sudeaseg CAA-002911 · RIF V-115329215</span><span className="flex items-center gap-1">Protegemos lo que mueve tu vida <Heart className="size-3 fill-current" /></span></div>
    </div>
  </footer>;
}