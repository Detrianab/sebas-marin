export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    console.log("[FLAG 1] Solicitud recibida en /api/chat");
    const body = req.body || {};
    const rawMessages = body.messages || (body.prompt ? [{ role: 'user', content: body.prompt }] : []);
    
    const apiKey = process.env['GOOGLE_GENERATIVE_AI_API_KEY'] || process.env['GEMINI_API_KEY'];

    if (!apiKey) {
      return res.status(500).json({ error: 'API Key de Google no configurada en Vercel' });
    }

    const contents = rawMessages.map((m: any) => {
      let text = '';
      if (typeof m.content === 'string') {
        text = m.content;
      } else if (Array.isArray(m.parts)) {
        text = m.parts.map((p: any) => p.text || (typeof p === 'string' ? p : '')).join(' ');
      } else if (typeof m.text === 'string') {
        text = m.text;
      }
      return {
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: text || 'Hola' }]
      };
    });

    const systemPrompt = `Eres "Asesor Sabas Marín", el asistente digital oficial de Sabas Marín Corredor de la Actividad Aseguradora. 
ROL: Asesor de seguros experto, cálido y profesional. Orienta al usuario sobre pólizas de salud, vehículos y patrimonios, conduciéndolo a cotizar o contactar.
ESTILO: Español formal y cercano. Respuestas breves (máximo 125 palabras).`;

    // Intentar con múltiples modelos en orden de prioridad
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro'];
    let data = null;
    let geminiRes = null;

    for (const model of models) {
      console.log(`[FLAG] Intentando con modelo: ${model}`);
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
      
      data = await geminiRes.json();
      if (geminiRes.ok) {
        console.log(`[FLAG] Éxito con el modelo: ${model}`);
        break;
      } else {
        console.warn(`[FLAG WARN] Modelo ${model} falló:`, data.error?.message);
      }
    }

    if (!geminiRes || !geminiRes.ok) {
      throw new Error(data?.error?.message || 'Error al comunicarse con Google Gemini en todos los modelos');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se obtuvo respuesta de la IA.';
    console.log("[FLAG 6] Respuesta extraída con éxito:", reply.substring(0, 50));

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(reply);

  } catch (error: any) {
    console.error('[FLAG ERROR DETALLADO]', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}