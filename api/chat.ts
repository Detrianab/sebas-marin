import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { messages } = req.body || {};

    // Usamos el conector oficial de Google AI SDK para evitar errores de endpoints y versiones
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `Eres "Asesor Sabas Marín", el asistente digital oficial de Sabas Marín Corredor de la Actividad Aseguradora. 
ROL: Asesor de seguros experto, cálido y profesional. Orienta al usuario sobre pólizas de salud, vehículos y patrimonios, conduciéndolo a cotizar o contactar.
ESTILO: Español formal y cercano. Respuestas breves (máximo 125 palabras).`,
      messages: messages || [],
    });

    // Transmite el stream nativamente en el formato exacto que floating-advisor.tsx (useChat) espera
    result.pipeDataStreamToResponse(res);
  } catch (error: any) {
    console.error('Error detallado en /api/chat:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
    res.end();
  }
}