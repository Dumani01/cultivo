const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createDb, initializeDb } = require('../src/services/db');
const { createApp } = require('../src/app');

const enabled = Boolean(process.env.MYSQL_TEST_DATABASE);
let db, app;

test('pruebas de integración MySQL', { skip: !enabled }, async () => {
  db = createDb({ database: process.env.MYSQL_TEST_DATABASE });
  await initializeDb(db);
  app = createApp({ db, ai: { preguntar: async () => ({ respuesta: 'ok', uso: {} }) } });
  assert.equal((await request(app).get('/api/health')).body.database, 'mysql');
  assert.ok((await request(app).get('/api/productos')).body.length >= 25);
  const note = await request(app).post('/api/notas').send({ titulo: 'Nota', contenido: 'Texto de prueba' });
  assert.equal(note.status, 201);
  assert.equal((await request(app).get(`/api/notas/${note.body.id}`)).body.titulo, 'Nota');
  await request(app).delete(`/api/notas/${note.body.id}`);
});

after(async () => { if (db) await db.close(); });
