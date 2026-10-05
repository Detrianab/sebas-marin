import { useEffect, useRef } from "react";
import { ArrowUpRight, Heart, Mail, Phone } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import teamImage from "@/assets/sabas-elisa.webp.asset.json";

export function CinematicFooter() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    void import("gsap").then(({ gsap }) => import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (!root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.from("[data-footer-reveal]", { y: 70, opacity: 0, stagger: .12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 78%" } });
        gsap.fromTo("[data-footer-image]", { clipPath: "inset(10% 10% 10% 10%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: "[data-footer-image]", start: "top 88%", once: true } });
        gsap.fromTo("[data-footer-image] img", { scale: 1.18, yPercent: -4 }, { scale: 1.04, yPercent: 2, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.1 } });
        gsap.fromTo("[data-footer-shine]", { xPercent: -10 }, { xPercent: 460, duration: 2.4, ease: "power2.inOut", repeat: -1, repeatDelay: 5.5, delay: 1.2 });
      }, root);
      cleanup = () => ctx.revert();
    }));
    return () => cleanup();
  }, []);
  return <footer ref={root} id="contacto" className="relative overflow-hidden bg-luxury px-5 pb-8 pt-28 text-primary-foreground sm:px-8 lg:pt-36">
    <div className="pointer-events-none absolute inset-x-0 top-4 whitespace-nowrap text-center font-display text-[18vw] font-bold leading-none text-primary-foreground/[.035]">SABAS MARIN</div>
     <div className="relative mx-auto max-w-[90rem]"><div className="grid items-end gap-10 lg:grid-cols-[1.1fr_.9fr]"><div data-footer-reveal className="max-w-5xl"><p className="text-[10px] font-bold uppercase text-metal">La protección correcta comienza con una conversación</p><h2 className="mt-6 text-4xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">Convirtamos la incertidumbre en respaldo.</h2></div><div data-footer-image className="relative overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_22%)]"><img src={teamImage.url} alt="Sabas Marin y Elisa en su oficina" width={1327} height={1200} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover object-top" /><div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,color-mix(in_oklab,var(--luxury)_94%,transparent)_0%,color-mix(in_oklab,var(--luxury)_30%,transparent)_42%,transparent_66%)]" /><div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--luxury)_0%,transparent_30%)]" /><div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_color-mix(in_oklab,var(--luxury)_55%,transparent)]" /><div aria-hidden data-footer-shine className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--metal)_20%,transparent),transparent)]" /></div></div>
      <div className="mt-14 grid gap-10 border-y border-primary-foreground/15 py-10 md:grid-cols-3">
        <div data-footer-reveal><BrandLogo inverse className="h-14" /><p className="mt-5 max-w-xs text-sm leading-6 text-primary-foreground/65">Intermediación técnica, ética y transparente para proteger personas, familias y empresas.</p></div>
         <div data-footer-reveal className="space-y-5"><p className="text-sm font-bold uppercase text-metal">Cotizaciones</p><a className="flex items-center gap-3 text-lg font-semibold" href="tel:+584122715551"><Phone className="size-5 shrink-0" /> 0412-2715551</a><a className="flex items-start gap-3 break-all text-base" href="mailto:atencionalcliente@sabasamarin.com"><Mail className="mt-1 size-5 shrink-0" /> atencionalcliente@sabasamarin.com</a></div>
         <div data-footer-reveal className="space-y-5"><p className="text-sm font-bold uppercase text-metal">Atención gerencial</p><a className="flex items-center gap-3 text-lg font-semibold" href="tel:+584148697158"><Phone className="size-5 shrink-0" /> 0414-8697158</a><a className="flex items-start gap-3 break-all text-base" href="mailto:gerencia@sabasmarin.com"><Mail className="mt-1 size-5 shrink-0" /> gerencia@sabasmarin.com</a><a href="/cotizar" className="inline-flex items-center gap-2 border-b border-metal pb-1 font-semibold">Solicitar cotización <ArrowUpRight /></a></div>
      </div>
      <div className="mt-6 flex flex-col gap-3 text-xs text-primary-foreground/50 sm:flex-row sm:justify-between"><span>Registro Sudeaseg CAA-002911 · RIF V-115329215</span><span className="flex items-center gap-1">Protegemos lo que mueve tu vida <Heart className="size-3 fill-current" /></span></div>
    </div>
  </footer>;
}