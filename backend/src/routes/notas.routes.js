const { z } = require('zod');
const validar = require('../middlewares/validar');
const { AppError } = require('../utils/errors');
const schema = z.object({ titulo: z.string().trim().min(1).max(100), contenido: z.string().trim().min(1).max(5000) }).strict();
const { rateLimit } = require('express-rate-limit');
const limiteResumen = rateLimit({ windowMs: 60 * 1000, limit: 8, standardHeaders:'draft-8', legacyHeaders:false });
function idValido(s) {
  const n = Number(s);
  if (!Number.isSafeInteger(n) || n <= 0) throw new AppError(400,'ID inválido','ID_INVALIDO');
  return n;
}
module.exports = ({ notas, ai }) => {
  const router = require('express').Router();
  /**
   * @openapi
   * /api/notas:
   *   get:
   *     tags: [Notas]
   *     summary: Lista todas las notas
   *     responses:
   *       200: { description: Lista de notas }
   */
  router.get('/', async (_req,res) => res.json(await notas.listar()));
  /**
   * @openapi
   * /api/notas:
   *   post:
   *     tags: [Notas]
   *     summary: Crea una nota
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/NotaNueva' }
   *     responses:
   *       201: { description: Nota creada }
   *       400: { description: Error de validación Zod }
   */
  router.post('/',validar(schema),async(req,res) => res.status(201).json(await notas.crear(req.body)));
  /**
   * @openapi
   * /api/notas/{id}/resumen:
   *   post:
   *     tags: [IA]
   *     summary: Resume el contenido de una nota en tres viñetas con Claude
   *     parameters:
   *       - { in: path, name: id, required: true, schema: { type: integer } }
   *     responses:
   *       200: { description: Resumen de tres viñetas }
   *       404: { description: Nota no encontrada (sin invocar a Claude) }
   *       429: { description: Límite de peticiones }
   *       502: { description: Error de Claude sin filtrar credenciales }
   *       503: { description: Claude no configurado o saturado }
   */
  router.post('/:id/resumen',limiteResumen,async (req,res) => {
    const n = await notas.buscar(idValido(req.params.id));
    const resultado = await ai.preguntar(n.contenido, 'Resume exclusivamente este texto en 3 viñetas breves, en español. No inventes información.');
    res.json({ notaId:n.id, resumen:resultado.respuesta, uso:resultado.uso });
  });
  /**
   * @openapi
   * /api/notas/{id}:
   *   get:
   *     tags: [Notas]
   *     summary: Obtiene una nota por ID
   *     parameters:
   *       - { in: path, name: id, required: true, schema: { type: integer } }
   *     responses:
   *       200: { description: Nota encontrada }
   *       400: { description: ID inválido }
   *       404: { description: Nota no encontrada }
   */
  router.get('/:id',async(req,res)=>res.json(await notas.buscar(idValido(req.params.id))));
  /**
   * @openapi
   * /api/notas/{id}:
   *   delete:
   *     tags: [Notas]
   *     summary: Elimina una nota
   *     parameters:
   *       - { in: path, name: id, required: true, schema: { type: integer } }
   *     responses:
   *       204: { description: Nota eliminada }
   *       400: { description: ID inválido }
   *       404: { description: Nota no encontrada }
   */
  router.delete('/:id',async(req,res)=>{await notas.eliminar(idValido(req.params.id));res.status(204).end()});
  return router;
};
