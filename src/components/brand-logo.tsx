import blueLogo from "@/assets/sabas-marin-blue.png.asset.json";
import whiteLogo from "@/assets/sabas-marin-white.png.asset.json";
import { cn } from "@/lib/utils";

export function BrandLogo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return <img src={(inverse ? whiteLogo : blueLogo).url} alt="Sabas Marin" className={cn("h-10 w-auto object-contain", className)} />;
}