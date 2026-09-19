export default async function handler(req: any, res: any) {
  console.log("📍 [FLAG 1] === INICIO DE /api/chat ===");
  console.log("📍 [FLAG 1.1] Método HTTP recibido:", req.method);

  if (req.method !== 'POST') {
    console.log("❌ [ERROR] Método no permitido:", req.method);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = req.body || {};
    console.log("📍 [FLAG 2] Cuerpo de la petición (body) analizado con éxito.");

    const messages = body.messages || (body.prompt ? [{ role: 'user', content: body.prompt }] : []);
    console.log("📍 [FLAG 3] Cantidad de mensajes a procesar:", messages.length);
    
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ [ERROR FLAG 3.1] ¡La API Key de Google no está configurada en Vercel!");
      return res.status(500).json({ error: 'API Key de Google no configurada en Vercel' });
    }
    console.log("📍 [FLAG 4] API Key de Google detectada correctamente.");

    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: typeof m.content === 'string' ? m.content : m.parts?.[0]?.text || '' }],
    }));
    console.log("📍 [FLAG 5] Historial de mensajes mapeado para el formato de Gemini.");

    const systemPrompt = `Eres "Asesor Sabas Marín", el asistente digital oficial de Sabas Marín Corredor de la Actividad Aseguradora. 
ROL: Asesor de seguros experto, cálido y profesional. Orienta al usuario sobre pólizas de salud, vehículos y patrimonios, conduciéndolo a cotizar o contactar.
ESTILO: Español formal y cercano. Respuestas breves (máximo 125 palabras).`;

    console.log("📍 [FLAG 6] Conectando con la API de Google Gemini (gemini-3.6-flash)...");

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
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

    console.log("📍 [FLAG 7] Respuesta HTTP recibida de Google. Status:", geminiRes.status);

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("❌ [ERROR FLAG 7.1] Google devolvió un error:", JSON.stringify(data));
      throw new Error(data.error?.message || 'Error al comunicarse con Google Gemini');
    }

    console.log("📍 [FLAG 8] JSON parseado con éxito. Extrayendo texto de la respuesta...");

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se obtuvo respuesta de la IA.';
    console.log("📍 [FLAG 9] >>> TEXTO GENERADO POR LA IA:", reply.substring(0, 80) + "...");

    // Configuramos las cabeceras del protocolo Vercel AI Data Stream v1
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Vercel-AI-Data-Stream', 'v1');
    res.setHeader('Transfer-Encoding', 'chunked');

    console.log("📍 [FLAG 10] Cabeceras de streaming configuradas. Enviando datos al frontend...");

    // Enviamos el chunk de texto válido (0:) y cerramos el stream limpiamente
    res.write(`0:${JSON.stringify(reply)}\n`);
    res.end();

    console.log("📍 [FLAG 11] === FIN DE /api/chat EJECUTADO EXITOSAMENTE ===");

  } catch (error: any) {
    console.error('❌ [ERROR FLAG CATCH CRÍTICO]:', error.message || error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
    res.end();
  }
}