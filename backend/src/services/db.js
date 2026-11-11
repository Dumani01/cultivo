const mysql = require('mysql2/promise');
const { categories, products } = require('../config/catalogo');

function createDb(options = {}) {
  const pool = mysql.createPool({
    host: options.host || process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(options.port || process.env.MYSQL_PORT || 3306),
    user: options.user || process.env.MYSQL_USER || 'root',
    password: options.password ?? process.env.MYSQL_PASSWORD ?? '',
    database: options.database || process.env.MYSQL_DATABASE || 'growlab',
    waitForConnections: true, connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
    charset: 'utf8mb4', dateStrings: true,
  });
  const api = {
    async all(sql, params = []) { const [rows] = await pool.query(sql, params); return rows; },
    async get(sql, params = []) { const rows = await api.all(sql, params); return rows[0]; },
    async run(sql, params = []) { const [result] = await pool.execute(sql, params); return { ...result, changes: result.affectedRows }; },
    async transaction(work) {
      const connection = await pool.getConnection();
      const tx = {
        all: (sql, params = []) => connection.execute(sql, params).then(([rows]) => rows),
        get: async (sql, params = []) => (await connection.execute(sql, params))[0][0],
        run: async (sql, params = []) => { const [result] = await connection.execute(sql, params); return { ...result, changes: result.affectedRows }; },
      };
      try { await connection.beginTransaction(); const result = await work(tx); await connection.commit(); return result; }
      catch (error) { await connection.rollback(); throw error; }
      finally { connection.release(); }
    },
    async close() { await pool.end(); },
  };
  return api;
}

async function initializeDb(db) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS categorias (slug VARCHAR(80) PRIMARY KEY, nombre VARCHAR(150) NOT NULL, icono VARCHAR(80) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS productos (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(120) UNIQUE NOT NULL, nombre VARCHAR(180) NOT NULL, categoria VARCHAR(80) NOT NULL, precio INT NULL, stock INT NOT NULL DEFAULT 0, etiqueta VARCHAR(80) NOT NULL DEFAULT '', descripcion TEXT NOT NULL, imagen VARCHAR(80) NOT NULL DEFAULT 'kit', destacado TINYINT(1) NOT NULL DEFAULT 0, activo TINYINT(1) NOT NULL DEFAULT 1, regulado TINYINT(1) NOT NULL DEFAULT 0, creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria) REFERENCES categorias(slug), CONSTRAINT chk_productos_stock CHECK (stock >= 0)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS pedidos (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, codigo VARCHAR(40) UNIQUE NOT NULL, idempotencia VARCHAR(100) UNIQUE NULL, nombre VARCHAR(120) NOT NULL, email VARCHAR(200) NOT NULL, telefono VARCHAR(40) NOT NULL, provincia VARCHAR(80) NOT NULL, direccion VARCHAR(300) NOT NULL, observaciones VARCHAR(600) NOT NULL DEFAULT '', subtotal INT NOT NULL, estado VARCHAR(30) NOT NULL DEFAULT 'pendiente', estado_pago VARCHAR(30) NOT NULL DEFAULT 'pendiente', creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS pedido_items (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, pedido_id INT UNSIGNED NOT NULL, producto_id INT UNSIGNED NOT NULL, nombre VARCHAR(180) NOT NULL, precio INT NOT NULL, cantidad INT NOT NULL, subtotal INT NOT NULL, CONSTRAINT fk_items_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id), CONSTRAINT fk_items_producto FOREIGN KEY (producto_id) REFERENCES productos(id), CONSTRAINT chk_items_cantidad CHECK (cantidad > 0)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS notas (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(120) NOT NULL, contenido TEXT NOT NULL, creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  ];
  for (const statement of statements) await db.run(statement);
  const indexes = [
    ['productos', 'idx_productos_categoria', 'CREATE INDEX idx_productos_categoria ON productos(categoria, activo)'],
    ['pedido_items', 'idx_pedido_items_pedido', 'CREATE INDEX idx_pedido_items_pedido ON pedido_items(pedido_id)'],
  ];
  for (const [table, name, statement] of indexes) {
    const existing = await db.get('SELECT 1 AS present FROM information_schema.statistics WHERE table_schema=DATABASE() AND table_name=? AND index_name=? LIMIT 1', [table, name]);
    if (!existing) await db.run(statement);
  }
  for (const cat of categories) await db.run('INSERT IGNORE INTO categorias(slug,nombre,icono) VALUES (?,?,?)', cat);
  for (const [slug, name, category, price, stock, tag, description, image, featured] of products) await db.run('INSERT IGNORE INTO productos(slug,nombre,categoria,precio,stock,etiqueta,descripcion,imagen,destacado,regulado) VALUES (?,?,?,?,?,?,?,?,?,?)', [slug, name, category, price, stock, tag, description, image, featured, 0]);
  await db.run("UPDATE productos SET categoria='genetica',precio=24900,stock=12,etiqueta='Plantines',descripcion='Plantines de cannabis de colección en maceta de vivero.',imagen='seedling',regulado=0 WHERE slug='plantines-cannabis' AND regulado=1");
  await db.run("DELETE FROM categorias WHERE slug='regulados' AND NOT EXISTS (SELECT 1 FROM productos WHERE categoria='regulados')");
}

module.exports = { createDb, initializeDb };
