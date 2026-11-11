const AnthropicSDK = require('@anthropic-ai/sdk');
const Anthropic = AnthropicSDK.default || AnthropicSDK.Anthropic || AnthropicSDK;
const { AppError } = require('../utils/errors');
async function preguntar(texto, system = 'Eres un asistente útil. Responde en español.') {
  if (!process.env.ANTHROPIC_API_KEY) throw new AppError(503, 'IA_NO_CONFIGURADA: agrega ANTHROPIC_API_KEY al .env del servidor.', 'IA_NO_CONFIGURADA');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 25000 });
  const respuesta = await client.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-haiku-5-5',
    max_tokens: 600,
    system,
    messages: [{ role: 'user', content: texto }],
  });
  const bloque = respuesta.content.find(b => b.type === 'text');
  return { respuesta: bloque?.text || '', uso: respuesta.usage };
}
module.exports = { preguntar };
