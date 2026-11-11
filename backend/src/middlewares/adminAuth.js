const crypto = require('crypto');
const { AppError } = require('../utils/errors');
const COOKIE='growlab_admin';
function sign(payload,secret) {
  const b=Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature=crypto.createHmac('sha256',secret).update(b).digest('base64url');
  return `${b}.${signature}`;
}
function verify(token,secret) {
  if (!token || !secret) return false;
  const [body,signature,extra]=token.split('.');
  if(!body||!signature||extra) return false;
  const expected=crypto.createHmac('sha256',secret).update(body).digest();
  let received;
  try { received=Buffer.from(signature,'base64url') } catch { return false }
  if(expected.length!==received.length||!crypto.timingSafeEqual(expected,received)) return false;
  try { const data=JSON.parse(Buffer.from(body,'base64url').toString()); return data.role==='admin'&&Number.isSafeInteger(data.exp)&&data.exp>Date.now() } catch {return false}
}
function secureOptions() { return { httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',maxAge:8*60*60*1000,path:'/api/admin' } }
function requireAdmin(req,_res,next) {
  if (!verify(req.cookies?.[COOKIE],process.env.ADMIN_SESSION_SECRET)) return next(new AppError(401,'Sesión administrativa requerida','NO_AUTORIZADO'));
  if (req.method !== 'GET' && req.get('X-Admin-Request') !== '1') return next(new AppError(403,'Falta protección de operación administrativa','CSRF'));
  next();
}
function login(password) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) throw new AppError(503,'Configura ADMIN_PASSWORD y ADMIN_SESSION_SECRET en .env','ADMIN_NO_CONFIGURADO');
  const supplied=crypto.createHash('sha256').update(password).digest();
  const expected=crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD).digest();
  if(!crypto.timingSafeEqual(supplied,expected)) throw new AppError(401,'Credenciales incorrectas','LOGIN_INVALIDO');
  return sign({role:'admin', exp:Date.now()+8*60*60*1000},process.env.ADMIN_SESSION_SECRET);
}
module.exports={COOKIE,secureOptions,requireAdmin,login};
