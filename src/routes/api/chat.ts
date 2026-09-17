import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayRunIdFetch, gatewayHeaders, getLovableAiGatewayRunId, withRunId } from "@/lib/ai-gateway.server";
import type { Database, Json } from "@/integrations/supabase/types";

const SYSTEM = `Eres el asesor virtual de Sabas Marin, corredor de la actividad aseguradora CAA-002911, con más de 25 años. Responde en español con calidez, precisión y brevedad. Tu función es orientar sobre salud, automóvil, hogar, empresa, accidentes, vida y gastos funerarios. Nunca inventes precios, clínicas afiliadas, coberturas o condiciones contractuales; explica que dependen de la póliza y ofrece solicitar una cotización o contactar al equipo.
Conocimiento oficial: para cotizar salud se requieren cédulas y fechas de nacimiento; vehículos, carnet o título; inmuebles, ubicación y valor estimado. Emergencias: atención inmediata según póliza; cirugías planificadas, rutina y preexistencias pueden tener esperas de 3, 6, 12 o 18 meses. AMP cubre consulta, estudios y telemedicina sin tocar la suma asegurada; Carta Aval autoriza cirugías y tratamientos programados. Pagos: anual o cuotas semestrales, trimestrales o mensuales según producto. Ante siniestro: acudir a clínica afiliada con clave de póliza y notificar aseguradora o equipo en plazo. Suma asegurada: máximo anual por asegurado; agotada, no hay cobertura hasta renovación salvo reinstalación. Edades referenciales: Caracas 60 exterior/65 con deducible; Mercantil 74; Oceánica y La Internacional 99. Preexistencias deben declararse y pueden excluirse. Reembolso fuera de red requiere pago, facturas e informes. Contactos: 0412-2715331 y atencionalcliente@sabasmarin.com. Gerencia: 0414-8697158 y gerencia@sabasmarin.com. Cierra respuestas complejas invitando a una asesoría humana.`;

export const Route = createFileRoute("/api/chat")({ server: { handlers: { POST: async ({ request }) => {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY']; const aiKey = process.env['LOVABLE_API_KEY'];
  if (!aiKey || (token && (!url || !key))) return new Response("Servicio no configurado.", { status: 500 });
  const body = await request.json() as { messages?: UIMessage[]; threadId?: string; anonymous?: boolean };
  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 18) return new Response("Solicitud incompleta.", { status: 400 });
  const totalText = body.messages.reduce((sum, message) => sum + message.parts.reduce((partSum, part) => partSum + (part.type === "text" ? part.text.length : 0), 0), 0);
  if (totalText > 12000) return new Response("La conversación es demasiado extensa.", { status: 413 });
  const isAnonymous = !token && body.anonymous === true;
  if (!token && !isAnonymous) return new Response("Inicia sesión para guardar conversaciones.", { status: 401 });
  let db: ReturnType<typeof createClient<Database>> | null = null;
  let userId = "";
  if (token && url && key) {
    db = createClient<Database>(url, key, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } });
    const { data: auth } = await db.auth.getUser(token);
    if (!auth.user) return new Response("Sesión vencida.", { status: 401 });
    userId = auth.user.id;
    if (!body.threadId) return new Response("Solicitud incompleta.", { status: 400 });
    const { data: thread } = await db.from("chat_threads").select("id").eq("id", body.threadId).single();
    if (!thread) return new Response("Conversación no disponible.", { status: 403 });
    const newest = body.messages.at(-1);
    if (newest?.role === "user") await db.from("chat_messages").insert({ thread_id: body.threadId, user_id: userId, role: "user", parts: newest.parts as Json });
  }
  const initialRunId = getLovableAiGatewayRunId(request); const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
  const lovable = createOpenAI({ baseURL: "https://ai.gateway.lovable.dev/v1", apiKey: aiKey, headers: { "Lovable-API-Key": aiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" }, fetch: runIdFetch.fetch });
  const result = streamText({ model: lovable.responses("openai/gpt-6-astra"), system: SYSTEM, messages: await convertToModelMessages(body.messages), abortSignal: request.signal, providerOptions: { openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] } } });
  const response = result.toUIMessageStreamResponse({ originalMessages: body.messages, sendReasoning: Boolean(token), headers: gatewayHeaders(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : undefined), onFinish: async ({ responseMessage, isAborted }) => { if (isAborted || responseMessage.parts.length === 0 || !db || !body.threadId || !userId) return; await db.from("chat_messages").insert({ thread_id: body.threadId, user_id: userId, role: "assistant", parts: responseMessage.parts as Json }); await db.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", body.threadId); } });
  return withRunId(response, runIdFetch);
} } } });