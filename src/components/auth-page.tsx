import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "./brand-logo";

export function AuthPage() {
  const navigate = useNavigate();
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true);
    const form = new FormData(event.currentTarget); const email = String(form.get("email") ?? ""); const password = String(form.get("password") ?? "");
    const result = signup ? await supabase.auth.signUp({ email, password }) : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) { toast.error(result.error.message); return; }
    if (signup && !result.data.session) { toast.success("Revisa tu correo para confirmar tu cuenta."); return; }
    void navigate({ to: "/asesor" });
  }
  return <main className="grid min-h-screen bg-luxury lg:grid-cols-[1.1fr_.9fr]"><div className="hidden bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--primary)_70%,transparent),transparent_65%)] p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between"><BrandLogo inverse className="h-14" /><div><p className="text-xs font-bold uppercase text-metal">Asesoría privada</p><h1 className="mt-5 max-w-2xl text-6xl font-semibold">Tu protección, tu historial, siempre contigo.</h1><p className="mt-6 max-w-lg text-primary-foreground/70">Guarda cada conversación y retoma tus consultas cuando lo necesites.</p></div><span className="text-xs text-primary-foreground/40">CAA-002911 · RIF V-115329215</span></div><div className="flex items-center justify-center bg-background p-5 sm:p-10"><div className="w-full max-w-md"><Link to="/" className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft /> Volver</Link><div className="mb-9 lg:hidden"><BrandLogo className="h-12" /></div><LockKeyhole className="size-8 text-primary" /><h2 className="mt-5 text-3xl font-semibold">{signup ? "Crea tu cuenta" : "Bienvenido de nuevo"}</h2><p className="mt-2 text-sm text-muted-foreground">Accede a tu asesor 24/7 y a tus conversaciones privadas.</p><form onSubmit={submit} className="mt-8 space-y-5"><div><Label htmlFor="email">Correo electrónico</Label><Input id="email" name="email" type="email" required autoComplete="email" className="mt-2 h-11" /></div><div><Label htmlFor="password">Contraseña</Label><Input id="password" name="password" type="password" required minLength={8} autoComplete={signup ? "new-password" : "current-password"} className="mt-2 h-11" /></div><Button className="h-11 w-full" disabled={busy}>{busy ? "Procesando…" : signup ? "Crear cuenta" : "Iniciar sesión"}</Button></form><Button variant="link" className="mt-4 w-full" onClick={() => setSignup((v) => !v)}>{signup ? "Ya tengo una cuenta" : "Quiero crear una cuenta"}</Button></div></div></main>;
}