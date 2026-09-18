export default async function handler(req: any, res: any) {
  console.log("=== INICIO DE /api/chat EJECUTÁNDOSE CORRECTAMENTE ===");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = req.body || {};
    const messages = body.messages || (body.prompt ? [{ role: 'user', content: body.prompt }] : []);
    
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("ERROR CRÍTICO: La API Key de Google no está definida en Vercel.");
      return res.status(500).json({ error: 'API Key de Google no configurada en Vercel' });
    }

    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: typeof m.content === 'string' ? m.content : m.parts?.[0]?.text || '' }],
    }));

    const systemPrompt = `Eres "Asesor Sabas Marín", el asistente digital oficial de Sabas Marín Corredor de la Actividad Aseguradora. 
ROL: Asesor de seguros experto, cálido y profesional. Orienta al usuario sobre pólizas de salud, vehículos y patrimonios, conduciéndolo a cotizar o contactar.
ESTILO: Español formal y cercano. Respuestas breves (máximo 125 palabras).`;

    console.log("Conectando con Google Gemini (gemini-1.5-flash)...");

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: contents,
        }),
      }
    );

    const data = await geminiRes.json();
    console.log("Respuesta HTTP de Gemini recibida con status:", geminiRes.status);

    if (!geminiRes.ok) {
      throw new Error(data.error?.message || 'Error al comunicarse con Google Gemini');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se obtuvo respuesta de la IA.';
    console.log(">>> TEXTO GENERADO EXITOSAMENTE POR LA IA:", reply.substring(0, 60) + "...");

    // Cabeceras exactas para el protocolo de streaming de Vercel AI SDK
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Vercel-AI-Data-Stream', 'v1');

    // Enviamos el stream estructurado que el cliente web espera
    const streamPayload = `0:${JSON.stringify(reply)}\ne:{"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":10}}\n`;
    
    return res.status(200).send(streamPayload);
  } catch (error: any) {
    console.error('ERROR DETALLADO EN EL BLOQUE CATCH:', error.message || error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}