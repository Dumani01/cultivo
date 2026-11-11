const { AppError } = require('../utils/errors');
module.exports = db => ({
  listar: () => db.all('SELECT id,titulo,contenido,creado_en AS creadoEn FROM notas ORDER BY id DESC'),
  buscar: async id => { const n = await db.get('SELECT id,titulo,contenido,creado_en AS creadoEn FROM notas WHERE id=?', [id]); if (!n) throw new AppError(404, 'Nota no encontrada', 'NOTA_NO_ENCONTRADA'); return n; },
  crear: async ({ titulo, contenido }) => { const r = await db.run('INSERT INTO notas(titulo,contenido) VALUES (?,?)', [titulo, contenido]); return db.get('SELECT id,titulo,contenido,creado_en AS creadoEn FROM notas WHERE id=?', [r.insertId]); },
  eliminar: async id => { const r = await db.run('DELETE FROM notas WHERE id=?', [id]); if (!r.changes) throw new AppError(404, 'Nota no encontrada', 'NOTA_NO_ENCONTRADA'); },
});
