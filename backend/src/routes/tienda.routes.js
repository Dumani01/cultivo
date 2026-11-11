const { z } = require('zod');
const validar = require('../middlewares/validar');
const { rateLimit } = require('express-rate-limit');
const pedidosLimit = rateLimit({ windowMs:15*60*1000, limit:12, standardHeaders:'draft-8', legacyHeaders:false });
const consultaLimit = rateLimit({ windowMs:15*60*1000, limit:20, standardHeaders:'draft-8', legacyHeaders:false });
const pedidoSchema = z.object({
  nombre:z.string().trim().min(2).max(90), email:z.email().max(200),
  telefono:z.string().trim().min(7).max(25),
  provincia:z.string().trim().min(2).max(60), direccion:z.string().trim().min(8).max(250),
  observaciones:z.string().trim().max(500).optional().default(''),
  items:z.array(z.object({ productoId:z.number().int().positive(), cantidad:z.number().int().min(1).max(20) }).strict()).min(1).max(35)
}).strict();
module.exports = ({ tienda }) => {
  const router = require('express').Router();
  /**
   * @openapi
   * /api/categorias:
   *   get:
   *     tags: [Tienda]
   *     summary: Lista categorías
   *     responses:
   *       200: { description: Categorías del catálogo }
   */
  router.get('/categorias',async(_req,res)=>res.json(await tienda.categorias()));
  /**
   * @openapi
   * /api/productos:
   *   get:
   *     tags: [Tienda]
   *     summary: Lista todos los productos activos
   *     responses:
   *       200: { description: Productos del catálogo }
   */
  router.get('/productos',async(req,res)=>{
    let list = await tienda.productos();
    if (typeof req.query.categoria==='string') list=list.filter(p=>p.categoria===req.query.categoria);
    if (typeof req.query.buscar==='string') {
      const q=req.query.buscar.slice(0,100).trim().toLocaleLowerCase('es');
      list=list.filter(p=>(p.nombre+' '+p.descripcion).toLocaleLowerCase('es').includes(q));
    }
    res.json(list);
  });
  /**
   * @openapi
   * /api/productos/{slug}:
   *   get:
   *     tags: [Tienda]
   *     summary: Detalle de producto
   *     parameters:
   *       - { in: path, name: slug, required: true, schema: { type: string } }
   *     responses:
   *       200: { description: Producto }
   *       404: { description: No encontrado }
   */
  router.get('/productos/:slug',async(req,res)=>res.json(await tienda.producto(req.params.slug)));
  /**
   * @openapi
   * /api/pedidos:
   *   post:
   *     tags: [Tienda]
   *     summary: Registra pedidos, calcula el total y descuenta stock atómicamente
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/PedidoNuevo' }
   *     responses:
   *       201: { description: Pedido registrado }
   *       400: { description: Validación fallida }
   *       409: { description: Inventario insuficiente }
   */
  router.post('/pedidos',pedidosLimit,validar(pedidoSchema),async(req,res)=>{
    const key=req.get('Idempotency-Key');
    const idempotencia=key && /^[a-zA-Z0-9_-]{8,100}$/.test(key) ? key : null;
    if (key && !idempotencia) return res.status(400).json({error:'Idempotency-Key inválida',codigo:'IDEMPOTENCIA_INVALIDA'});
    res.status(201).json(await tienda.crearPedido(req.body,idempotencia));
  });
  /**
   * @openapi
   * /api/pedidos/consultar:
   *   post:
   *     tags: [Tienda]
   *     summary: Busca un pedido con código y email
   *     responses:
   *       200: { description: Estado del pedido }
   *       404: { description: Pedido no encontrado }
   */
  router.post('/pedidos/consultar',consultaLimit,validar(z.object({codigo:z.string().trim().min(8).max(50),email:z.email()}).strict()),async(req,res)=>{
    res.json(await tienda.consultar(req.body.codigo,req.body.email));
  });
  return router;
};
