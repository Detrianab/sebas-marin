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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
    const payload = JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: contents,
    });

    let data: any = null;
    let success = false;
    let retries = 3;
    let delay = 1000;

    for (let i = 0; i <= retries; i++) {
      const geminiRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });

      data = await geminiRes.json();

      if (geminiRes.ok) {
        success = true;
        break;
      }

      const errMsg = data?.error?.message || '';
      const isHighDemand = errMsg.includes('high demand') || geminiRes.status === 503 || geminiRes.status === 429;

      if (isHighDemand && i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        break;
      }
    }

    if (!success) {
      throw new Error(data?.error?.message || 'El servicio de IA está experimentando alta demanda temporal. Intenta de nuevo en unos segundos.');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se obtuvo respuesta de la IA.';
    console.log(">>> JSON ENVIADO EXITOSAMENTE:", reply.substring(0, 50));

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ reply }));

  } catch (error: any) {
    console.error('Error detallado en /api/chat:', error);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message || 'Error interno del servidor' }));
  }
}