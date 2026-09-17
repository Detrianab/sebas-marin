"use client";

import type React from "react";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LocationMapProps {
  location?: string;
  coordinates?: string;
  mapsUrl: string;
  className?: string;
}

const streets = [18, 38, 62, 82];

export function LocationMap({
  location = "Sabas Marin",
  coordinates = "Abrir ubicación exacta",
  mapsUrl,
  className,
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-80, 80], [3, -3]), { stiffness: 220, damping: 28 });
  const rotateY = useSpring(useTransform(mouseX, [-80, 80], [-3, 3]), { stiffness: 220, damping: 28 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = containerRef.current;
    if (!node || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = node.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  };

  const resetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetTilt}
      className={cn("relative overflow-hidden border border-primary-foreground/15 bg-luxury text-primary-foreground shadow-2xl", className)}
    >
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Reducir mapa" : "Expandir mapa"}
        className="absolute inset-0 z-10 cursor-pointer"
      />
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(var(--map-line)_1px,transparent_1px),linear-gradient(90deg,var(--map-line)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_15%,color-mix(in_oklab,var(--primary)_42%,transparent)_100%)]" />

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            {streets.map((position, index) => (
              <motion.span key={`h-${position}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: index * 0.06 }} className="absolute left-0 h-px w-full origin-left bg-primary-foreground/15" style={{ top: `${position}%` }} />
            ))}
            {streets.map((position, index) => (
              <motion.span key={`v-${position}`} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: index * 0.06 }} className="absolute top-0 h-full w-px origin-top bg-primary-foreground/15" style={{ left: `${position}%` }} />
            ))}
            <div className="absolute left-[15%] top-[20%] h-[21%] w-[23%] border border-primary-foreground/10 bg-primary-foreground/[.035]" />
            <div className="absolute right-[12%] top-[12%] h-[28%] w-[26%] border border-primary-foreground/10 bg-primary-foreground/[.035]" />
            <div className="absolute bottom-[14%] left-[38%] h-[24%] w-[30%] border border-primary-foreground/10 bg-primary-foreground/[.035]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none relative z-20 flex min-h-80 flex-col justify-between p-6 sm:min-h-[26rem] sm:p-9">
        <div className="flex items-start justify-between">
          <span className="flex size-11 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur"><Navigation className="size-5" /></span>
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase"><span className="size-2 rounded-full bg-map-live shadow-[0_0_16px_var(--map-live)]" />Ubicación</span>
        </div>

        <motion.div animate={{ y: isHovered ? -5 : 0 }} className="absolute left-[57%] top-[48%]">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary-foreground/20" />
          <span className="relative flex size-14 items-center justify-center rounded-full border border-primary-foreground/35 bg-primary shadow-xl"><MapPin className="size-6" /></span>
        </motion.div>

        <div>
          <p className="text-[10px] font-bold uppercase text-metal">Punto de atención</p>
          <h3 className="mt-3 text-3xl font-semibold sm:text-5xl">{location}</h3>
          <p className="mt-2 text-sm text-primary-foreground/60">{coordinates}</p>
          <Button asChild size="lg" className="pointer-events-auto mt-6 bg-primary-foreground text-luxury hover:bg-primary-foreground/90">
            <a href={mapsUrl} target="_blank" rel="noreferrer">Ver ruta en Google Maps <ArrowUpRight /></a>
          </Button>
        </div>
      </div>
      <span className="pointer-events-none absolute bottom-5 right-5 z-20 text-[10px] uppercase text-primary-foreground/45">{isExpanded ? "Toca para reducir" : "Toca para explorar"}</span>
    </motion.div>
  );
}