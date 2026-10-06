export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = req.body || {};
    const messages = body.messages || (body.prompt ? [{ role: 'user', content: body.prompt }] : []);
    
    const apiKey = process.env['GOOGLE_GENERATIVE_AI_API_KEY'] || process.env['GEMINI_API_KEY'];

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

    const targets = [
      { url: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent', model: 'gemini-1.5-flash (v1)' },
      { url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', model: 'gemini-2.0-flash (v1beta)' },
      { url: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent', model: 'gemini-1.5-pro (v1)' }
    ];

    let data = null;
    let geminiRes = null;

    for (const target of targets) {
      console.log(`Intentando con endpoint/modelo: ${target.model}`);
      geminiRes = await fetch(`${target.url}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: contents,
        }),
      });
      
      data = await geminiRes.json();
      if (geminiRes.ok) {
        console.log(`Éxito con ${target.model}`);
        break;
      } else {
        console.warn(`Falló ${target.model}:`, data?.error?.message);
      }
    }

    if (!geminiRes || !geminiRes.ok) {
      throw new Error(data?.error?.message || 'Error al comunicarse con Google Gemini');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se obtuvo respuesta de la IA.';
    console.log(">>> RESPUESTA ENVIADA EXITOSAMENTE:", reply.substring(0, 50));

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(reply);

  } catch (error: any) {
    console.error('Error detallado en /api/chat:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}