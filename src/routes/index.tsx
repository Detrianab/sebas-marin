import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Sabas Marin | Protección que responde" },
    { name: "description", content: "Cotiza seguros de salud, automóvil, hogar, empresa, vida y accidentes con asesoría experta." },
    { property: "og:title", content: "Sabas Marin | Protección que responde" },
    { property: "og:description", content: "Más de 25 años ofreciendo intermediación aseguradora técnica, ética y transparente." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <HomePage />;
}
