import { lazy, Suspense, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, BadgeCheck, Quote, ShieldCheck, Sparkles } from "lucide-react";
import heroPortrait from "@/assets/sabas-hero-2026.webp";
import protectionImage from "@/assets/sabas-consultation.webp";
import caracasLogo from "@/assets/seguros-caracas.webp";
import oceanicaLogo from "@/assets/oceanica-seguros.webp";
import internacionalLogo from "@/assets/la-internacional.webp";
import mercantilLogo from "@/assets/mercantil-seguros.webp";
import mundialLogo from "@/assets/la-mundial-seguros.webp";
import hispanaLogo from "@/assets/hispana-seguros.webp";
import constitucionLogo from "@/assets/seguros-constitucion.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LocationMap } from "@/components/ui/expand-map";
import { CinematicFooter } from "./cinematic-footer";
import { Preloader } from "./preloader";
import { SiteHeader } from "./site-header";
import { faqs, services } from "@/lib/site-data";

const FloatingAdvisor = lazy(() => import("./floating-advisor").then((module) => ({ default: module.FloatingAdvisor })));
const mapsUrl = "https://maps.app.goo.gl/8CdzYHN7sLWmthqJA?g_st=ipc";
const allies = [
  { name: "Seguros Caracas", image: caracasLogo },
  { name: "Oceánica de Seguros", image: oceanicaLogo },
  { name: "La Internacional de Seguros", image: internacionalLogo },
  { name: "Mercantil Seguros", image: mercantilLogo },
  { name: "La Mundial de Seguros", image: mundialLogo },
  { name: "Hispana de Seguros", image: hispanaLogo },
  { name: "Seguros Constitución", image: constitucionLogo },
];

export function HomePage() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.from("[data-hero-word]", { yPercent: 105, stagger: 0.12, duration: 1.25, ease: "power4.out", delay: 0.12 });
        gsap.from("[data-hero-detail]", { y: 24, opacity: 0, stagger: 0.1, duration: 0.8, delay: 0.5 });
        gsap.to("[data-hero-image]", { scale: 1.06, ease: "none", scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: 0.8 } });
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
       <section id="inicio" className="relative isolate flex min-h-[min(800px,92svh)] items-end overflow-hidden bg-luxury text-primary-foreground lg:min-h-[min(850px,92svh)]">
         <div className="absolute inset-x-0 top-16 h-[55%] overflow-hidden lg:inset-0 lg:h-full lg:w-[66%] [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)] lg:[mask-image:linear-gradient(to_right,black_70%,transparent_100%)]">
           <img data-hero-image src={heroPortrait} alt="Sabas Marin en su oficina" width={1600} height={1393} fetchPriority="high" decoding="async" className="size-full object-cover object-[28%_20%] lg:object-[center_30%]" />
         </div>
         <div aria-hidden className="hero-photo-wash pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--luxury)_0%,transparent_60%)] lg:bg-[linear-gradient(to_right,transparent_45%,var(--luxury)_100%)]" />
         <div aria-hidden className="pointer-events-none absolute inset-x-0 top-20 h-px bg-primary-foreground/15 lg:hidden" />
         <div className="relative mx-auto grid w-full max-w-[90rem] px-5 pb-8 pt-[min(52svh,450px)] sm:px-8 lg:min-h-[min(850px,92svh)] lg:grid-cols-[48%_52%] lg:items-end lg:pb-12 lg:pt-32">
           <div className="hidden lg:block" aria-hidden />
           <div className="min-w-0 lg:pl-10 xl:pl-16">
             <p data-hero-detail className="flex items-center gap-3 text-[10px] font-bold uppercase text-metal sm:text-xs"><span className="h-px w-8 shrink-0 bg-metal" />Corredor de la actividad aseguradora</p>
             <h1 className="mt-4 font-semibold leading-[1.04] sm:mt-6">
               <span className="block overflow-hidden pb-1 text-[clamp(2.8rem,7vw,6rem)]"><span data-hero-word className="block">Sabas Marin.</span></span>
               <span className="mt-2 block overflow-hidden pb-1 text-[clamp(1.65rem,3.4vw,3.4rem)] leading-[1.15] text-primary-foreground/90"><span data-hero-word className="block">Tu tranquilidad es nuestra prioridad.</span></span>
             </h1>
             <div data-hero-detail className="mt-6 border-l border-metal pl-4 sm:mt-8 sm:pl-6">
               <p className="max-w-md text-sm leading-6 text-primary-foreground/85 sm:text-base sm:leading-7">Más de 25 años de trayectoria convirtiendo decisiones complejas en protección clara, técnica y humana.</p>
             </div>
             <div data-hero-detail className="mt-8 flex items-center justify-between gap-4 border-t border-primary-foreground/20 pt-5 lg:mt-14">
               <span className="text-[10px] font-bold uppercase text-metal">Sudeaseg · CAA-002911</span>
               <a href="#manifiesto" aria-label="Descubrir nuestra convicción" className="inline-flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase text-primary-foreground/80 transition-colors hover:text-primary-foreground">Descubrir <ArrowDown className="size-4" /></a>
             </div>
           </div>
         </div>
       </section>

        <section className="overflow-hidden border-y border-border bg-background py-8" aria-label="Aseguradoras aliadas"><p className="mb-7 px-5 text-center text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">Aseguradoras aliadas</p><div className="logo-loop-track flex w-max items-center" aria-label={allies.map(({ name }) => name).join(", ")}>{[0, 1].map((copy) => <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-5 px-2.5 sm:gap-10 sm:px-5">{allies.map(({ name, image }) => <div key={name} className="flex h-20 w-56 shrink-0 items-center justify-center px-3 sm:h-24 sm:w-72 sm:px-5"><img src={image} alt={copy === 0 ? name : ""} width={820} height={260} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" /></div>)}</div>)}</div></section>

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
            <Metric value="7+" label="Aseguradoras aliadas" hint="Las principales empresas a nivel nacional" />
            <Metric value="24/7" label="Orientación inmediata" hint="Asesor sin registro" />
          </div>
        </div>
      </section>

       <section id="proteccion" className="bg-luxury px-5 py-20 text-primary-foreground sm:px-8 sm:py-28 lg:py-36"><div className="mx-auto max-w-[90rem]"><div data-reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="text-[10px] font-bold uppercase text-metal">Arquitectura de protección</p><h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-[1.15] sm:text-5xl sm:leading-[1.1] lg:text-6xl">Una estrategia distinta para cada riesgo.</h2></div><p className="max-w-sm text-sm leading-6 text-primary-foreground/60">Analizamos, comparamos y explicamos para que cada cobertura tenga una razón.</p></div><div className="mt-12 grid gap-px bg-primary-foreground/20 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">{services.map(({ id, label, icon: Icon, text }, index) => <article data-reveal key={id} className="group relative flex min-h-80 flex-col overflow-hidden bg-luxury p-6 transition-colors hover:bg-primary sm:p-8"><span className="absolute right-6 top-5 text-5xl font-semibold text-primary-foreground/10 transition-colors group-hover:text-primary-foreground/20">0{index + 1}</span><span className="flex size-16 items-center justify-center border border-metal/50 bg-primary-foreground/[.06] transition-transform group-hover:-translate-y-1"><Icon className="size-8 shrink-0 text-metal" /></span><h3 className="mt-8 text-2xl font-semibold leading-tight sm:text-3xl">{label}</h3><p className="mt-4 max-w-sm pb-8 text-sm leading-7 text-primary-foreground/80">{text}</p><Button asChild variant="outline" className="mt-auto w-full justify-between border-primary-foreground/50 bg-primary-foreground text-luxury hover:bg-metal hover:text-luxury"><Link to="/cotizar" search={{ ramo: id }}>Cotizar {label} <ArrowRight className="size-4" /></Link></Button><span className="absolute bottom-0 left-0 h-1 w-0 bg-metal transition-all duration-500 group-hover:w-full" /></article>)}</div></div></section>

       <section id="trayectoria" className="px-5 py-20 sm:px-8 sm:py-28 lg:py-40"><div className="mx-auto grid max-w-[90rem] items-center gap-12 lg:grid-cols-[1.12fr_.88fr] lg:gap-14"><div data-reveal className="relative overflow-hidden bg-secondary"><img data-story-image src={protectionImage} alt="Sabas Marin atendiendo personalmente a una cliente" width={1400} height={933} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" /><div className="absolute bottom-0 right-0 bg-primary px-5 py-4 text-primary-foreground sm:px-7 sm:py-6"><strong className="block text-3xl sm:text-4xl">+25</strong><span className="text-[9px] font-bold uppercase">años de trayectoria</span></div></div><div data-reveal className="lg:pl-8"><p className="text-[10px] font-bold uppercase text-primary">Sabas Marin · Corredor de la actividad aseguradora</p><h2 className="mt-5 text-3xl font-semibold leading-[1.15] sm:text-5xl sm:leading-[1.1] lg:text-6xl">Entender primero. Elegir mejor. Responder siempre.</h2><p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground">Más de 25 años de trayectoria. Asesoramos con rigor técnico, ética y transparencia. Desde la elección de tu póliza hasta el momento en que realmente necesitas usarla. Registro Sudeaseg CAA-002911.</p><div className="mt-9 grid gap-6 sm:grid-cols-2"><Value icon={BadgeCheck} title="Excelencia profesional" text="Experiencia aplicada a cada decisión." /><Value icon={ShieldCheck} title="Cumplimiento y ética" text="Claridad durante todo el proceso." /></div><Button asChild size="lg" className="mt-10 h-12"><Link to="/cotizar" search={{ ramo: undefined }}>Diseñar mi protección <ArrowRight /></Link></Button></div></div></section>

       <section className="border-y border-border bg-background px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="ramos-title"><div className="mx-auto max-w-[90rem]"><p className="text-xs font-bold uppercase text-primary">Soluciones a tu medida</p><h2 id="ramos-title" className="mt-4 max-w-3xl text-3xl font-semibold sm:text-5xl">Protección para cada etapa y cada patrimonio.</h2><div className="mt-12 grid gap-px bg-border md:grid-cols-3"><InsuranceGroup number="01" title="Seguros de Automóvil" items={["Pólizas de RCV", "Auto individual", "Flotas"]} /><InsuranceGroup number="02" title="Seguros de Personas" items={["Pólizas de Vida", "Accidentes Personales individuales y colectivos", "Salud individual y colectiva"]} /><InsuranceGroup number="03" title="Seguros Patrimoniales" items={["Pólizas de Hogar", "Pólizas de Empresas", "Responsabilidad Civil General", "Responsabilidad Patronal y Empresarial", "Transporte", "Embarcaciones", "Fianzas"]} /></div></div></section>

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
function InsuranceGroup({ number, title, items }: { number: string; title: string; items: string[] }) { return <div className="bg-background p-7 sm:p-9"><span className="text-xs font-bold text-primary">{number} /</span><h3 className="mt-6 text-2xl font-semibold">{title}</h3><ul className="mt-7 space-y-4 text-sm leading-6 text-muted-foreground">{items.link((item: string) => <Link key={item} ...>{item}</Link> || <li key={item} className="border-l border-primary/40 pl-4">{item}</li>)}</ul></div>; }