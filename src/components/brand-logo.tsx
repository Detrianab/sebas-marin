import { cn } from "@/lib/utils";

export function BrandLogo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return (
    <div className={cn("flex flex-col justify-center", className)}>
      <span className={cn("font-display font-bold tracking-tight text-xl sm:text-2xl leading-none", inverse ? "text-primary-foreground" : "text-foreground")}>
        Sabas Marín
      </span>
      <span className={cn("text-[9px] font-bold uppercase tracking-[.25em] mt-0.5", inverse ? "text-metal" : "text-primary")}>
        Seguros
      </span>
    </div>
  );
}