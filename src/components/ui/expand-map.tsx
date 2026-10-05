import { ArrowUpRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LocationMapProps {
  location?: string;
  coordinates?: string;
  mapsUrl: string;
  className?: string;
}

const embedUrl = "https://www.google.com/maps?output=embed&q=Sabas+Marin+-+Corredor+de+Seguros";

export function LocationMap({ location = "Sabas Marin", coordinates = "Atención personalizada · Venezuela", mapsUrl, className }: LocationMapProps) {
  return <div className={cn("grid overflow-hidden border border-border bg-luxury lg:grid-cols-[1.35fr_.65fr]", className)}>
    <div className="relative min-h-80 bg-secondary sm:min-h-[27rem]">
      <iframe src={embedUrl} title="Ubicación de Sabas Marin – Corredor de Seguros en Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 size-full border-0" allowFullScreen />
    </div>
    <div className="flex min-w-0 flex-col justify-between gap-12 p-7 text-primary-foreground sm:p-10">
      <MapPin className="size-8 text-metal" aria-hidden="true" />
      <div>
        <p className="text-xs font-bold uppercase text-metal">Punto de atención</p>
        <h3 className="mt-4 text-3xl font-semibold sm:text-4xl">{location}</h3>
        <p className="mt-3 text-sm leading-6 text-primary-foreground/70">{coordinates}</p>
        <Button asChild size="lg" className="mt-8 bg-primary-foreground text-luxury hover:bg-primary-foreground/90"><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Ver ruta en Google Maps <ArrowUpRight /></a></Button>
      </div>
    </div>
  </div>;
}