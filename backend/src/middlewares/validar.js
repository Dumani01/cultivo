module.exports = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const { AppError } = require('../utils/errors');
    const err = new AppError(400, 'Datos inválidos', 'VALIDACION');
    err.details = result.error.issues.map(i => ({ campo: i.path.join('.'), mensaje: i.message }));
    return next(err);
  }
  req[source] = result.data;
  next();
};
