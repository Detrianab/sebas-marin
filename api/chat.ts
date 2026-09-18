export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const messages = body.messages || (body.prompt ? [{ role: 'user', content: body.prompt }] : []);
    
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key de Google no configurada en Vercel' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: typeof m.content === 'string' ? m.content : m.parts?.[0]?.text || '' }],
    }));

    const systemPrompt = `Eres "Asesor Sabas Marín", el asistente digital oficial de Sabas Marín Corredor de la Actividad Aseguradora. 
ROL: Asesor de seguros experto, cálido y profesional. Orienta al usuario sobre pólizas de salud, vehículos y patrimonios, conduciéndolo a cotizar o contactar.
ESTILO: Español formal y cercano. Respuestas breves (máximo 125 palabras).`;

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

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      throw new Error(data.error?.message || 'Error al comunicarse con Google Gemini');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se obtuvo respuesta de la IA.';

    // Verificamos en los logs que se generó
    console.log(">>> RESPUESTA ENVIADA A LA UI:", reply);

    // Creamos el flujo de datos cumpliendo estrictamente el Data Stream Protocol v1 de Vercel AI SDK
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // 1. Enviamos el bloque de texto con el prefijo 0:
        const textChunk = `0:${JSON.stringify(reply)}\n`;
        controller.enqueue(encoder.encode(textChunk));

        // 2. Enviamos el marcador de finalización obligatorio con el prefijo e:
        const finishChunk = `e:{"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":10}}\n`;
        controller.enqueue(encoder.encode(finishChunk));

        // 3. Cerramos el stream correctamente
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
      },
    });
  } catch (error: any) {
    console.error('Error detallado en /api/chat:', error);
    return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}