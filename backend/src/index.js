require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { createDb, initializeDb } = require('./services/db');
const { createApp } = require('./app');

async function main() {
  const db = createDb();
  await initializeDb(db);
  const app = createApp({ db });
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';
  const server = app.listen(port, host, () => {
    console.log(`GrowLab API: http://${host}:${port}/api/health`);
    console.log(`Swagger: http://${host}:${port}/api-docs`);
  });
  const shutdown = () => server.close(async () => { await db.close(); process.exit(0); });
  process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown);
}
main().catch(error => { console.error('No se pudo iniciar GrowLab con MySQL:', error.message); process.exit(1); });
