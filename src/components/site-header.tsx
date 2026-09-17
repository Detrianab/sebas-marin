import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bot, Menu } from "lucide-react";
import { BrandLogo } from "./brand-logo";

const links = [["Protección", "#proteccion"], ["Trayectoria", "#trayectoria"], ["Ubicación", "#ubicacion"], ["Preguntas", "#preguntas"]];

export function SiteHeader() {
  return <header className="fixed inset-x-0 top-0 z-40 border-b border-primary-foreground/10 bg-luxury/80 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between px-5 lg:px-8">
      <a href="#inicio" aria-label="Sabas Marin, inicio"><BrandLogo inverse className="h-11" /></a>
      <nav className="hidden items-center gap-7 md:flex">{links.map(([name, href]) => <a key={href} href={href} className="text-xs font-semibold uppercase text-primary-foreground/75 transition-colors hover:text-primary-foreground">{name}</a>)}</nav>
      <div className="hidden items-center gap-2 md:flex"><Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => window.dispatchEvent(new CustomEvent("open-advisor"))}><Bot /> Asesor 24/7</Button><Button asChild className="bg-primary-foreground text-luxury hover:bg-primary-foreground/90"><a href="/cotizar">Cotizar ahora</a></Button></div>
      <Sheet><SheetTrigger asChild><Button size="icon" variant="ghost" className="text-primary-foreground md:hidden" aria-label="Abrir menú"><Menu /></Button></SheetTrigger><SheetContent className="bg-luxury text-primary-foreground"><SheetTitle className="sr-only">Menú</SheetTitle><BrandLogo inverse className="mt-8 h-12" /><nav className="mt-14 flex flex-col gap-6">{links.map(([name, href]) => <SheetClose asChild key={href}><a href={href} className="text-2xl font-semibold">{name}</a></SheetClose>)}<Button asChild className="mt-4 bg-primary-foreground text-luxury"><a href="/cotizar">Cotizar ahora</a></Button><SheetClose asChild><Button variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground" onClick={() => window.dispatchEvent(new CustomEvent("open-advisor"))}>Asesor 24/7</Button></SheetClose></nav></SheetContent></Sheet>
    </div>
  </header>;
}