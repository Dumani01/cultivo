const express=require('express');
const helmet=require('helmet');
const cookieParser=require('cookie-parser');
const swaggerUi=require('swagger-ui-express');
const swaggerSpec=require('./config/swagger');
const errorHandler=require('./middlewares/errorHandler');
const {AppError}=require('./utils/errors');
const {tiendaService}=require('./services/tienda.service');
const notasService=require('./services/notas.service');
const claudeService=require('./services/claude.service');
const path=require('path');
const fs=require('fs');
function createApp({db,ai=claudeService}={}) {
  if(!db) throw new Error('Debes proporcionar una conexión de base de datos');
  const app=express();
  app.disable('x-powered-by');
  // Swagger usa scripts y estilos inline; CSP de Helmet bloquearía su UI.
  app.use(helmet({contentSecurityPolicy:false}));
  app.use(express.json({limit:'40kb'}));
  app.use(cookieParser());
  const tienda=tiendaService(db);
  const notas=notasService(db);
  app.get('/api/health',(_req,res)=>res.json({ok:true,servicio:'GrowLab API',database:'mysql'}));
  app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec,{customSiteTitle:'GrowLab API | Swagger'}));
  app.get('/api/openapi.json',(_req,res)=>res.json(swaggerSpec));
  app.use('/api/notas',require('./routes/notas.routes')({notas,ai}));
  app.use('/api/ia',require('./routes/ia.routes')({ai,tienda}));
  app.use('/api',require('./routes/tienda.routes')({tienda}));
  app.use('/api/admin',require('./routes/admin.routes')({tienda}));
  app.use('/api',(req,_res,next)=>next(new AppError(404,'Endpoint no encontrado','NO_ENCONTRADO')));
  const dist=path.resolve(__dirname,'../../frontend/dist');
  if(fs.existsSync(path.join(dist,'index.html'))) {
    app.use(express.static(dist));
    app.get('/{*path}',(_req,res)=>res.sendFile(path.join(dist,'index.html')));
  }
  app.use(errorHandler);
  return app;
}
module.exports={createApp};
