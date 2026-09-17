import blueLogo from "@/assets/sabas-marin-blue.png";
import whiteLogo from "@/assets/sabas-marin-white.png";
import { cn } from "@/lib/utils";

export function BrandLogo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return <img src={(inverse ? whiteLogo : blueLogo).url} alt="Sabas Marin" className={cn("h-10 w-auto object-contain", className)} />;
}