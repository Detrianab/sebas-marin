import { lazy, Suspense, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, BadgeCheck, Quote, ShieldCheck, Sparkles } from "lucide-react";
import heroImage from "@/assets/sabas-marin-hero.jpg";
import protectionImage from "@/assets/sabas-marin-protection.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LocationMap } from "@/components/ui/expand-map";
import { CinematicFooter } from "./cinematic-footer";
import { Preloader } from "./preloader";
import { SiteHeader } from "./site-header";
import { faqs, services } from "@/lib/site-data";

const FloatingAdvisor = lazy(() => import("./floating-advisor").then((module) => ({ default: module.FloatingAdvisor })));
const mapsUrl = "https://maps.app.goo.gl/8CdzYHN7sLWmthqJA?g_st=ipc";

export function HomePage() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.from("[data-hero-word]", { yPercent: 115, rotate: 2, stagger: 0.08, duration: 1.15, ease: "power4.out", delay: 0.12 });
        gsap.from("[data-hero-detail]", { y: 24, opacity: 0, stagger: 0.1, duration: 0.8, delay: 0.5 });
        gsap.to("[data-hero-image]", { scale: 1.14, yPercent: 8, ease: "none", scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: 0.8 } });
        gsap.to("[data-orbit]", { rotate: 55, ease: "none", scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: 1.2 } });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => gsap.fromTo(element, { y: 32 }, { y: 0, duration: 0.85, ease: "power3.out", clearProps: "transform", scrollTrigger: { trigger: element, start: "top 92%", once: true } }));
        gsap.fromTo("[data-story-image]", { clipPath: "inset(12% 12% 12% 12%)", scale: 1.08 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "none", scrollTrigger: { trigger: "#trayectoria", start: "top 80%", end: "center 50%", scrub: 1 } });
        gsap.fromTo("[data-manifesto-word]", { yPercent: 108, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: "power4.out", stagger: 0.035, scrollTrigger: { trigger: "#manifiesto", start: "top 78%", once: true } });
        gsap.fromTo("[data-manifesto-line]", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: "#manifiesto", start: "top 85%", once: true } });
        gsap.utils.toArray<HTMLElement>("[data-metric]").forEach((element, index) => gsap.fromTo(element, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: index * 0.1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: element, start: "top 92%", once: true } }));
      }, root);
      cleanup = () => ctx.revert();
    });
    return () => cleanup();
  }, []);

  return <div ref={root} className="bg-background"><Preloader /><SiteHeader />
    <main>
      <section id="inicio" className="relative flex min-h-[94svh] items-end overflow-hidden bg-luxury pt-24 text-primary-foreground">
        <img data-hero-image src={heroImage} alt="Familia protegida por la asesoría de Sabas Marin" width={1920} height={1088} fetchPriority="high" decoding="async" className="absolute inset-0 size-full object-cover object-[64%_center] opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--luxury)_2%,color-mix(in_oklab,var(--luxury)_88%,transparent)_38%,transparent_76%),linear-gradient(0deg,var(--luxury)_0%,transparent_54%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_55%,color-mix(in_oklab,var(--primary)_18%,transparent))]" />
        <div data-orbit className="absolute -right-[14vw] top-[12vh] size-[42vw] min-h-96 min-w-96 rounded-full border border-primary-foreground/10"><span className="absolute left-[8%] top-[28%] size-2 rounded-full bg-metal shadow-[0_0_22px_var(--metal)]" /></div>
        <div className="relative mx-auto w-full max-w-[90rem] px-5 pb-12 sm:px-8 lg:pb-14">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_290px]">
            <div className="max-w-5xl">
              <p data-hero-detail className="flex items-center gap-3 text-[10px] font-bold uppercase text-metal"><span className="h-px w-10 bg-metal" />Corredor de la actividad aseguradora · CAA-002911</p>
              <h1 className="mt-5 text-[clamp(3.3rem,8.2vw,8.6rem)] font-semibold leading-[.88]">
                <span className="block overflow-hidden"><span data-hero-word className="block">Tu futuro.</span></span>
                <span className="block overflow-hidden"><span data-hero-word className="block font-normal text-primary-foreground/68">Bien protegido.</span></span>
              </h1>
            </div>
            <div data-hero-detail className="pb-2"><p className="text-sm leading-6 text-primary-foreground/68">Más de 25 años convirtiendo decisiones complejas en protección clara, técnica y humana.</p><div className="mt-6 flex flex-col gap-3"><Button asChild size="lg" className="h-12 bg-primary-foreground text-luxury hover:bg-primary-foreground/90"><Link to="/cotizar" search={{ ramo: undefined }}>Cotizar mi protección <ArrowRight /></Link></Button><span className="text-[10px] uppercase text-primary-foreground/45">Asesor virtual disponible sin registro</span></div></div>
          </div>
          <a href="#manifiesto" aria-label="Descubrir" className="mt-9 inline-flex items-center gap-3 text-[10px] font-bold uppercase text-primary-foreground/50"><span className="flex size-9 items-center justify-center rounded-full border border-primary-foreground/20"><ArrowDown className="size-4" /></span>Descubrir</a>
        </div>
      </section>

      <section className="overflow-hidden border-y border-border bg-background py-5" aria-label="Aseguradoras aliadas"><div className="flex w-max animate-marquee items-center gap-16 pr-16 text-[10px] font-bold uppercase text-muted-foreground"><span>Seguros Caracas</span><i className="size-1 rounded-full bg-primary" /><span>Oceánica de Seguros</span><i className="size-1 rounded-full bg-primary" /><span>La Internacional de Seguros</span><i className="size-1 rounded-full bg-primary" /><span>Mercantil Seguros</span><i className="size-1 rounded-full bg-primary" /><span>Seguros Caracas</span><i className="size-1 rounded-full bg-primary" /><span>Oceánica de Seguros</span><i className="size-1 rounded-full bg-primary" /><span>La Internacional de Seguros</span><i className="size-1 rounded-full bg-primary" /><span>Mercantil Seguros</span></div></section>

      <section id="manifiesto" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:py-44">
        <span aria-hidden className="pointer-events-none absolute -left-8 top-8 select-none text-[22vw] font-semibold leading-none text-primary/[.045] sm:-left-4">Criterio</span>
        <span aria-hidden className="pointer-events-none absolute -right-40 top-1/3 size-[34rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_70%)] blur-2xl" />
        <div className="relative mx-auto max-w-[90rem]">
          <div className="flex items-center gap-4">
            <p data-reveal className="text-[10px] font-bold uppercase tracking-[.3em] text-primary">Nuestra convicción</p>
            <span data-manifesto-line className="h-px flex-1 origin-left bg-border" />
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:items-end lg:gap-16">
            <h2 className="max-w-5xl text-[clamp(2rem,5.4vw,5.2rem)] font-semibold leading-[1.06]">
              {"La protección no se improvisa. Se diseña alrededor de la vida que has construido.".split(" ").map((word, index) => (
                <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[.12em] align-bottom">
                  <span data-manifesto-word className="inline-block pr-[.26em]">{word}</span>
                </span>
              ))}
            </h2>
            <div data-reveal className="border-l-2 border-primary pl-6">
              <p className="text-base leading-8 text-muted-foreground">Cada póliza que recomendamos nace de un análisis técnico, no de una plantilla. Comparamos coberturas, explicamos condiciones y acompañamos el siniestro hasta el final.</p>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[.25em] text-primary">Sudeaseg CAA-002911</p>
            </div>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-sm bg-border sm:mt-24 md:grid-cols-3">
            <Metric value="25+" label="Años de trayectoria" hint="Experiencia acumulada" />
            <Metric value="04" label="Aseguradoras aliadas" hint="Comparación real" />
            <Metric value="24/7" label="Orientación inmediata" hint="Asesor sin registro" />
          </div>
        </div>
      </section>

      <section id="proteccion" className="bg-luxury px-5 py-20 text-primary-foreground sm:px-8 sm:py-28 lg:py-36"><div className="mx-auto max-w-[90rem]"><div data-reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="text-[10px] font-bold uppercase text-metal">Arquitectura de protección</p><h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-[1.15] sm:text-5xl sm:leading-[1.1] lg:text-6xl">Una estrategia distinta para cada riesgo.</h2></div><p className="max-w-sm text-sm leading-6 text-primary-foreground/60">Analizamos, comparamos y explicamos para que cada cobertura tenga una razón.</p></div><div className="mt-12 grid border-l border-t border-primary-foreground/15 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">{services.map(({ id, label, icon: Icon, text }, index) => <article data-reveal key={id} className="group relative flex min-h-80 flex-col overflow-hidden border-b border-r border-primary-foreground/15 p-6 transition-colors hover:bg-primary-foreground/[.06] sm:p-7"><span className="text-[10px] text-primary-foreground/40">0{index + 1}</span><Icon className="mt-9 size-8 shrink-0 text-metal sm:mt-12" /><h3 className="mt-5 text-xl font-semibold leading-tight sm:text-2xl">{label}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-primary-foreground/55">{text}</p><Link to="/cotizar" search={{ ramo: id }} className="mt-auto flex items-center gap-2 pt-8 text-xs font-bold uppercase text-primary-foreground">Cotizar <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link><span className="absolute bottom-0 left-0 h-px w-0 bg-metal transition-all duration-500 group-hover:w-full" /></article>)}</div></div></section>

      <section id="trayectoria" className="px-5 py-20 sm:px-8 sm:py-28 lg:py-40"><div className="mx-auto grid max-w-[90rem] items-center gap-12 lg:grid-cols-[1.12fr_.88fr] lg:gap-14"><div data-reveal className="relative overflow-hidden bg-secondary"><img data-story-image src={protectionImage} alt="Familia protegida junto a su hogar y vehículo" width={1600} height={1104} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" /><div className="absolute bottom-0 right-0 bg-primary px-5 py-4 text-primary-foreground sm:px-7 sm:py-6"><strong className="block text-3xl sm:text-4xl">+25</strong><span className="text-[9px] font-bold uppercase">años de trayectoria</span></div></div><div data-reveal className="lg:pl-8"><p className="text-[10px] font-bold uppercase text-primary">Criterio que protege</p><h2 className="mt-5 text-3xl font-semibold leading-[1.15] sm:text-5xl sm:leading-[1.1] lg:text-6xl">Entender primero. Elegir mejor. Responder siempre.</h2><p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground">Asesoramos con rigor técnico, ética y transparencia. Desde la elección de tu póliza hasta el momento en que realmente necesitas usarla.</p><div className="mt-9 grid gap-6 sm:grid-cols-2"><Value icon={BadgeCheck} title="Excelencia profesional" text="Experiencia aplicada a cada decisión." /><Value icon={ShieldCheck} title="Cumplimiento y ética" text="Claridad durante todo el proceso." /></div><Button asChild size="lg" className="mt-10 h-12"><Link to="/cotizar" search={{ ramo: undefined }}>Diseñar mi protección <ArrowRight /></Link></Button></div></div></section>

      <section className="border-y border-border bg-secondary px-5 py-20 sm:px-8 lg:py-28"><div data-reveal className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row"><Quote className="size-10 shrink-0 text-primary" /><blockquote className="text-3xl font-medium leading-snug sm:text-5xl">“No vendemos pólizas. Construimos la certeza de que, ante lo inesperado, tendrás una solución que responde.”</blockquote></div></section>

      <section id="ubicacion" className="px-5 py-24 sm:px-8 lg:py-36"><div className="mx-auto max-w-[90rem]"><div data-reveal className="mb-12 grid gap-6 lg:grid-cols-2"><div><p className="text-[10px] font-bold uppercase text-primary">Estamos cerca</p><h2 className="mt-5 text-4xl font-semibold sm:text-6xl">Una conversación puede cambiar cómo proteges tu futuro.</h2></div><p className="self-end text-sm leading-7 text-muted-foreground lg:justify-self-end lg:max-w-sm">Consulta la ubicación compartida y abre la ruta exacta desde tu dispositivo.</p></div><div data-reveal><LocationMap location="Sabas Marin" coordinates="Atención personalizada · Venezuela" mapsUrl={mapsUrl} /></div></div></section>

      <section id="preguntas" className="bg-secondary px-5 py-24 sm:px-8 lg:py-36"><div className="mx-auto grid max-w-[90rem] gap-14 lg:grid-cols-[.75fr_1.25fr]"><div data-reveal className="lg:sticky lg:top-28 lg:self-start"><p className="text-[10px] font-bold uppercase text-primary">Antes de decidir</p><h2 className="mt-5 text-4xl font-semibold sm:text-6xl">Respuestas claras. Sin letra pequeña.</h2><p className="mt-6 max-w-sm leading-7 text-muted-foreground">¿Necesitas otra respuesta? El asesor flotante está disponible sin registro.</p><Sparkles className="mt-8 size-8 text-primary" /></div><Accordion type="single" collapsible className="border-t border-border">{faqs.map(([question, answer], index) => <AccordionItem key={question} value={`faq-${index}`}><AccordionTrigger className="py-7 text-left text-base sm:text-lg">{question}</AccordionTrigger><AccordionContent className="max-w-2xl pr-8 text-base leading-7 text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>
    </main>
    <CinematicFooter />
    <Suspense fallback={null}><FloatingAdvisor /></Suspense>
  </div>;
}

function Metric({ value, label, hint }: { value: string; label: string; hint: string }) {
  return (
    <div data-metric className="group relative overflow-hidden bg-background px-6 py-12 transition-colors hover:bg-secondary sm:px-8">
      <strong className="block text-5xl font-semibold leading-none text-primary sm:text-6xl">{value}</strong>
      <span className="mt-4 block text-[10px] font-bold uppercase tracking-[.22em] text-foreground">{label}</span>
      <span className="mt-2 block text-sm text-muted-foreground">{hint}</span>
      <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
function Value({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) { return <div className="border-l border-primary pl-5"><Icon className="size-6 text-primary" /><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{text}</p></div>; }