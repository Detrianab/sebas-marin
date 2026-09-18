import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

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

    const systemPrompt = `Eres "Asesor Sabas Marín", el asistente digital oficial de Sabas Marín Corredor de la Actividad Aseguradora. 
ROL: Asesor de seguros experto, cálido y profesional. Orienta al usuario sobre pólizas de salud, vehículos y patrimonios, conduciéndolo a cotizar o contactar.
ESTILO: Español formal y cercano. Respuestas breves (máximo 125 palabras).`;

    // Usamos el SDK oficial de Vercel AI para conectar con Gemini y transmitir el stream
    const result = await streamText({
      model: google('gemini-1.5-flash', { apiKey }),
      system: systemPrompt,
      messages: messages,
    });

    // Esto envía el flujo de datos exacto que el hook useChat de tu página web sabe leer y pintar
    result.pipeDataStreamToResponse(res);
  } catch (error: any) {
    console.error('Error detallado en /api/chat:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}