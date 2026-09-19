export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = req.body || {};
    const messages = body.messages || (body.prompt ? [{ role: 'user', content: body.prompt }] : []);
    
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API Key de Google no configurada en Vercel' });
    }

    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: typeof m.content === 'string' ? m.content : m.parts?.[0]?.text || '' }],
    }));

    const systemPrompt = `Eres "Asesor Sabas Marín", el asistente digital oficial de Sabas Marín Corredor de la Actividad Aseguradora. 
ROL: Asesor de seguros experto, cálido y profesional. Orienta al usuario sobre pólizas de salud, vehículos y patrimonios, conduciéndolo a cotizar o contactar.
ESTILO: Español formal y cercano. Respuestas breves (máximo 125 palabras).`;

    // Usamos gemini-1.5-flash sobre v1beta, el cual es altamente estable
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

    if (!geminiRes.ok) {
      throw new Error(data.error?.message || 'Error al comunicarse con Google Gemini');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se obtuvo respuesta de la IA.';

    // Configuramos las cabeceras para el Data Stream Protocol v1 en Node.js
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Vercel-AI-Data-Stream', 'v1');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Enviamos el texto y el marcador de finalización que floating-advisor espera
    res.write(`0:${JSON.stringify(reply)}\n`);
    res.write(`e:{"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":10}}\n`);
    res.end();

  } catch (error: any) {
    console.error('Error detallado en /api/chat:', error);
    
    // Si Google bota error de alta demanda, enviamos un mensaje legible al chat en lugar de romper la UI
    const errorText = error.message.includes('high demand')
      ? 'El servicio está experimentando alta demanda temporal. Por favor, intenta de nuevo en unos segundos.'
      : 'Lo siento, ocurrió un error procesando tu consulta.';

    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('X-Vercel-AI-Data-Stream', 'v1');
      res.write(`0:${JSON.stringify(errorText)}\n`);
      res.write(`e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`);
      res.end();
    } else {
      res.end();
    }
  }
}