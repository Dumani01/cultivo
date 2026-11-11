const { z } = require('zod');
const validar = require('../middlewares/validar');
const { rateLimit } = require('express-rate-limit');
const limit = rateLimit({ windowMs:60*1000, limit:8, standardHeaders:'draft-8', legacyHeaders:false });
const preguntaSchema = z.object({ pregunta:z.string().trim().min(3).max(2000) }).strict();
const recomendacionSchema = z.object({ tipo:z.enum(['indoor','outdoor','ambos']), presupuesto:z.number().int().min(0).max(5000000), consulta:z.string().trim().min(3).max(500) }).strict();
const sys = `Eres el asistente de GrowLab, una tienda de suministros de horticultura de Costa Rica. Asesora con lenguaje claro sobre equipamiento general de jardinería: iluminación LED de espectro completo, carpas, macetas, riego, sustratos y sensores. No inventes disponibilidad ni precios; si no conoces algo, dilo. No ofrezcas pasos para cultivar sustancias ilícitas ni para eludir controles. No aconsejes radiación UV sin advertir sobre seguridad ocular y cutánea. Responde en español y de forma concisa.`;
module.exports = ({ ai, tienda }) => {
  const router = require('express').Router();
  /**
   * @openapi
   * /api/ia/preguntar:
   *   post:
   *     tags: [IA]
   *     summary: Envía una pregunta libre a Claude desde el servidor
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/Pregunta' }
   *     responses:
   *       200: { description: Respuesta y tokens utilizados }
   *       400: { description: Pregunta inválida }
   *       429: { description: Rate limit }
   *       502: { description: Claude no disponible }
   *       503: { description: Falta la API key o saturación }
   */
  router.post('/preguntar',limit,validar(preguntaSchema),async (req,res)=>{
    res.json(await ai.preguntar(req.body.pregunta,sys));
  });
  /**
   * @openapi
   * /api/ia/recomendar:
   *   post:
   *     tags: [IA]
   *     summary: Sugiere suministros de horticultura disponibles según presupuesto
   *     responses:
   *       200: { description: Recomendación de Claude }
   *       400: { description: Datos inválidos }
   *       503: { description: Claude no configurado }
   */
  router.post('/recomendar',limit,validar(recomendacionSchema),async(req,res)=>{
    const { tipo, presupuesto, consulta } = req.body;
    const catalogo = (await tienda.productos()).filter(p=>p.stock>0 && p.precio<=presupuesto)
      .slice(0,30).map(p=>`${p.nombre}: ₡${p.precio}`).join('; ');
    const r = await ai.preguntar(`Tipo de jardín: ${tipo}. Presupuesto total: ₡${presupuesto}. Solicitud: ${consulta}. Productos disponibles bajo presupuesto: ${catalogo}. Sugiere opciones del catálogo sin inventar precios.`,sys);
    res.json(r);
  });
  return router;
};
