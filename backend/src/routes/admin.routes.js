const { z } = require('zod');
const { rateLimit } = require('express-rate-limit');
const validar = require('../middlewares/validar');
const { COOKIE, secureOptions, requireAdmin, login } = require('../middlewares/adminAuth');
const { AppError } = require('../utils/errors');
const loginLimit=rateLimit({windowMs:15*60*1000,limit:7,standardHeaders:'draft-8',legacyHeaders:false});
const productSchema=z.object({
  slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  nombre:z.string().trim().min(3).max(120),
  categoria:z.enum(['kits','iluminacion','carpas','macetas','sustratos','riego','medicion','herramientas','genetica']),
  precio:z.number().int().min(0).max(20000000),stock:z.number().int().min(0).max(100000),
  descripcion:z.string().trim().min(10).max(1000),
  etiqueta:z.string().trim().max(30).optional(),
  imagen:z.enum(['kit','outdoor','hydro','light','uv','tent','fan','pot','pots','tray','soil','bottle','water','timer','meter','tools','seedling','seeds']).optional(),
  destacado:z.boolean().optional(),
}).strict();
const updateSchema=z.object({
  nombre:z.string().trim().min(3).max(120).optional(),
  precio:z.number().int().min(0).max(20000000).optional(),
  stock:z.number().int().min(0).max(100000).optional(),
  descripcion:z.string().trim().min(10).max(1000).optional(),
  etiqueta:z.string().trim().max(30).optional(),
  imagen:z.string().regex(/^[a-z]+$/).max(40).optional(),
  destacado:z.boolean().optional(),activo:z.boolean().optional(),
}).strict();
const idNum=x=>{const n=Number(x);if(!Number.isSafeInteger(n)||n<1)throw new AppError(400,'ID inválido');return n};
module.exports=({tienda})=>{
  const router = require('express').Router();
  /**
   * @openapi
   * /api/admin/login:
   *   post:
   *     tags: [Administración]
   *     summary: Inicia sesión administrativa con cookie HttpOnly
   *     responses:
   *       200: { description: Sesión iniciada }
   *       401: { description: Credenciales inválidas }
   */
  router.post('/login',loginLimit,validar(z.object({password:z.string().min(1).max(256)}).strict()),(req,res)=>{
    res.cookie(COOKIE,login(req.body.password),secureOptions()).json({ok:true});
  });
  router.post('/logout',(_req,res)=>res.clearCookie(COOKIE,{...secureOptions(),maxAge:undefined}).json({ok:true}));
  router.get('/session',requireAdmin,(_req,res)=>res.json({authenticated:true}));
  router.use(requireAdmin);
  /**
   * @openapi
   * /api/admin/stats:
   *   get:
   *     tags: [Administración]
   *     summary: Métricas administrativas protegidas
   *     responses:
   *       200: { description: Estadísticas }
   *       401: { description: Sesión requerida }
   */
  router.get('/stats',async(_req,res)=>res.json(await tienda.adminStats()));
  router.get('/pedidos',async(_req,res)=>res.json(await tienda.adminOrders()));
  router.get('/clientes',async(_req,res)=>res.json(await tienda.adminClients()));
  router.patch('/pedidos/:id',validar(z.object({estado:z.enum(['pendiente','confirmado','preparacion','enviado','completado','cancelado'])}).strict()),async(req,res)=>res.json(await tienda.updateStatus(idNum(req.params.id),req.body.estado)));
  router.get('/productos',async(_req,res)=>res.json(await tienda.productos({incluirInactivos:true})));
  router.post('/productos',validar(productSchema),async(req,res)=>{
    try {res.status(201).json(await tienda.crearProducto(req.body))}
    catch(err) {if(err.code==='SQLITE_CONSTRAINT_UNIQUE'||err.code==='SQLITE_CONSTRAINT_PRIMARYKEY') throw new AppError(409,'Ya existe un producto con ese slug');throw err}
  });
  router.patch('/productos/:id',validar(updateSchema),async(req,res)=>res.json(await tienda.actualizarProducto(idNum(req.params.id),req.body)));
  router.delete('/productos/:id',async(req,res)=>res.json(await tienda.actualizarProducto(idNum(req.params.id),{activo:false})));
  return router;
};
