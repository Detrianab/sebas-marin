import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/auth-page";
export const Route = createFileRoute("/acceso")({
  head: () => ({ meta: [{ title: "Acceso privado | Sabas Marin" }, { name: "description", content: "Accede a tu asesor asegurador virtual y conserva tus conversaciones." }, { property: "og:title", content: "Acceso privado | Sabas Marin" }, { property: "og:description", content: "Tu asesoría aseguradora privada disponible 24/7." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AuthPage,
});