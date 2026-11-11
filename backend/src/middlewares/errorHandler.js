const AnthropicSDK = require('@anthropic-ai/sdk');
const Anthropic = AnthropicSDK.default || AnthropicSDK.Anthropic || AnthropicSDK;
const APIError = AnthropicSDK.APIError || Anthropic.APIError;
const { AppError } = require('../utils/errors');
module.exports = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message, codigo: err.code, ...(err.details ? { detalles: err.details } : {}) });
  }
  if (APIError && err instanceof APIError) {
    console.error('Claude API:', err.status, err.name);
    return res.status(err.status === 429 ? 429 : err.status === 529 ? 503 : 502)
      .json({ error: 'IA_NO_DISPONIBLE', codigo: 'IA_NO_DISPONIBLE' });
  }
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'JSON inválido', codigo: 'JSON_INVALIDO' });
  console.error('Error interno:', err);
  return res.status(500).json({ error: 'Error interno del servidor', codigo: 'ERROR_INTERNO' });
};
