export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Método no permitido' }));
    return;
  }

  try {
    const body = req.body || {};
    const messages = body.messages || (body.prompt ? [{ role: 'user', content: body.prompt }] : []);
    
    const apiKey = process.env['GOOGLE_GENERATIVE_AI_API_KEY'] || process.env['GEMINI_API_KEY'];

    if (!apiKey) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'API Key de Google no configurada en Vercel' }));
      return;
    }

    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: typeof m.content === 'string' ? m.content : m.parts?.[0]?.text || '' }],
    }));

    const systemPrompt = `Eres "Asesor Sabas Marín", el asistente digital oficial de Sabas Marín Corredor de la Actividad Aseguradora. 
ROL: Asesor de seguros experto, cálido y profesional. Orienta al usuario sobre pólizas de salud, vehículos y patrimonios, conduciéndolo a cotizar o contactar.
ESTILO: Español formal y cercano. Respuestas breves (máximo 125 palabras).`;

    // Lista de modelos oficiales ordenados por disponibilidad y velocidad
    const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-3.8-flash'];
    
    let data: any = null;
    let success = false;
    let finalReply = 'No se obtuvo respuesta de la IA.';

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: contents,
      });

      console.log(`Intentando conectar con modelo: ${model}`);

      try {
        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
        });

        data = await geminiRes.json();

        if (geminiRes.ok) {
          finalReply = data.candidates?.[0]?.content?.parts?.[0]?.text || finalReply;
          success = true;
          console.log(`Éxito con el modelo: ${model}`);
          break;
        } else {
          console.warn(`Modelo ${model} no disponible o con alta demanda:`, data?.error?.message);
        }
      } catch (err: any) {
        console.warn(`Error al conectar con ${model}:`, err.message);
      }
    }

    if (!success) {
      throw new Error('Todos los modelos de Gemini están experimentando alta demanda en este momento. Por favor intenta de nuevo en unos segundos.');
    }

    console.log(">>> RESPUESTA ENVIADA EXITOSAMENTE:", finalReply.substring(0, 50));

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ reply: finalReply }));

  } catch (error: any) {
    console.error('Error detallado en /api/chat:', error);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message || 'Error interno del servidor' }));
  }
}
