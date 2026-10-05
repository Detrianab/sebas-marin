import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const starters = ["¿Qué necesito para cotizar salud?", "¿Cómo reporto un siniestro?", "Quiero proteger mi empresa"];

export function FloatingAdvisor() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat", body: { anonymous: true } }), []);
  const { messages, sendMessage, status, stop, error } = useChat({ transport, onFinish: () => requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })) });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    const openAdvisor = () => setOpen(true);
    window.addEventListener("open-advisor", openAdvisor);
    return () => window.removeEventListener("open-advisor", openAdvisor);
  }, []);

  const submit = async (text: string) => {
    const value = text.trim().slice(0, 1200);
    if (!value || busy) return;
    setDraft("");
    await sendMessage({ text: value });
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.97 }}
            className="absolute bottom-20 right-0 flex h-[min(620px,calc(100svh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden border border-primary-foreground/15 bg-luxury text-primary-foreground shadow-2xl"
            aria-label="Asesor virtual"
          >
            <header className="flex items-center justify-between border-b border-primary-foreground/10 px-5 py-4">
              <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground text-luxury"><Bot className="size-4" /></span><div><strong className="block text-sm">Asesor Sabas Marin</strong><span className="flex items-center gap-1.5 text-[11px] text-primary-foreground/55"><span className="size-1.5 rounded-full bg-map-live" /> Disponible ahora</span></div></div>
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Cerrar asesor" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><X /></Button>
            </header>
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.length === 0 && <div><Sparkles className="size-6 text-metal" /><h2 className="mt-4 text-2xl font-semibold">¿Qué necesitas proteger?</h2><p className="mt-2 text-sm leading-6 text-primary-foreground/60">Pregunta sobre coberturas, requisitos, pagos o emergencias. No necesitas registrarte.</p><div className="mt-5 space-y-2">{starters.map((question) => <Button key={question} variant="outline" onClick={() => void submit(question)} className="h-auto w-full justify-start whitespace-normal border-primary-foreground/15 bg-primary-foreground/5 px-3 py-3 text-left text-xs text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">{question}</Button>)}</div></div>}
              {messages.map((message) => <div key={message.id} className={cn("max-w-[88%] text-sm leading-6", message.role === "user" ? "ml-auto bg-primary px-4 py-3" : "border-l border-metal/60 pl-4 text-primary-foreground/80")}>{message.parts.map((part, index) => part.type === "text" ? <p className="whitespace-pre-wrap" key={index}>{part.text}</p> : null)}</div>)}
              {status === "submitted" && <div className="flex items-center gap-2 text-xs text-primary-foreground/55"><span className="size-1.5 animate-pulse rounded-full bg-metal" />Analizando tu consulta…</div>}
              {error && <p className="border border-destructive/40 bg-destructive/10 p-3 text-xs">No pudimos responder ahora. Intenta de nuevo en un momento.</p>}
            </div>
            <form onSubmit={(event) => { event.preventDefault(); void submit(draft); }} className="border-t border-primary-foreground/10 p-3">
              <div className="flex items-end gap-2 bg-primary-foreground/[.07] p-2"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(draft); } }} maxLength={1200} rows={2} placeholder="Escribe tu pregunta…" className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-primary-foreground/35" /><Button type={busy ? "button" : "submit"} onClick={busy ? stop : undefined} size="icon" aria-label={busy ? "Detener respuesta" : "Enviar pregunta"} className="shrink-0 rounded-full bg-primary-foreground text-luxury hover:bg-primary-foreground/90">{busy ? <X /> : <Send />}</Button></div>
              <p className="mt-2 px-1 text-[9px] text-primary-foreground/40">Orientación general. No compartas datos sensibles.</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
        <Button onClick={() => setOpen((value) => !value)} aria-label={open ? "Cerrar asesor virtual" : "Abrir asesor virtual"} className="relative size-16 rounded-full border border-primary-foreground/20 bg-luxury p-0 text-primary-foreground shadow-2xl hover:bg-primary">
          <span className="absolute inset-0 animate-ping rounded-full border border-primary/35" />
          {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
          {!open && <span className="absolute -right-1 -top-1 size-4 rounded-full border-2 border-background bg-map-live" />}
        </Button>
      </motion.div>
    </div>
  );
}