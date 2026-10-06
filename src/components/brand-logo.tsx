import whiteLogo from "@/assets/sabas-marin-white.png";
import { cn } from "@/lib/utils";

export function BrandLogo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return (
    <img 
      src={whiteLogo} 
      alt="Sabas Marin - Corredor de la Actividad Aseguradora" 
      className={cn("h-12 w-auto object-contain", className)} 
    />
  );
}