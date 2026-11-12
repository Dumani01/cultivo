-- Datos semilla de demostración para GrowLab.
-- Ejecutar después de SCHEMA_MYSQL.sql sobre la base cultivo.
-- Todos los registros son ficticios y las operaciones son repetibles.

INSERT IGNORE INTO categorias (slug, nombre, icono) VALUES
  ('kits', 'Kits completos', 'PackageOpen'),
  ('iluminacion', 'Iluminación LED', 'Sun'),
  ('carpas', 'Carpas y clima', 'Warehouse'),
  ('macetas', 'Macetas', 'Sprout'),
  ('sustratos', 'Sustratos y abonos', 'Leaf'),
  ('riego', 'Riego e hidroponía', 'Droplets'),
  ('medicion', 'Medición y control', 'Gauge'),
  ('herramientas', 'Accesorios', 'Wrench'),
  ('genetica', 'Semillas y plantines', 'Sprout');

INSERT INTO productos (slug, nombre, categoria, precio, stock, etiqueta, descripcion, imagen, destacado, activo, regulado)
VALUES
  ('seed-kit-demo', 'Kit de demostración GrowLab', 'kits', 49900, 10, 'Demo', 'Producto semilla para pruebas del catálogo.', 'kit', 0, 1, 0),
  ('soil-demo', 'Sustrato de demostración 10 L', 'sustratos', 7900, 25, 'Demo', 'Producto semilla para pruebas de inventario.', 'soil', 0, 1, 0),
  ('note-tool-demo', 'Herramienta de demostración', 'herramientas', 5900, 15, 'Demo', 'Producto semilla para probar pedidos y stock.', 'tools', 0, 1, 0)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), stock = VALUES(stock), activo = VALUES(activo);

INSERT INTO pedidos (codigo, idempotencia, nombre, email, telefono, provincia, direccion, observaciones, subtotal, estado, estado_pago)
VALUES ('GL-SEED-0001', 'seed-order-0001', 'Cliente Demo', 'demo@growlab.local', '88880000', 'San José', 'Dirección ficticia para pruebas', 'Pedido de demostración', 63700, 'pendiente', 'pendiente')
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);
SET @seed_pedido_id = LAST_INSERT_ID();
DELETE FROM pedido_items WHERE pedido_id = @seed_pedido_id;

INSERT INTO pedido_items (pedido_id, producto_id, nombre, precio, cantidad, subtotal)
SELECT @seed_pedido_id, id, nombre, precio, 1, precio
FROM productos WHERE slug = 'seed-kit-demo'
ON DUPLICATE KEY UPDATE subtotal = VALUES(subtotal);

INSERT INTO pedido_items (pedido_id, producto_id, nombre, precio, cantidad, subtotal)
SELECT @seed_pedido_id, id, nombre, precio, 1, precio
FROM productos WHERE slug = 'soil-demo'
ON DUPLICATE KEY UPDATE subtotal = VALUES(subtotal);

INSERT INTO pedido_items (pedido_id, producto_id, nombre, precio, cantidad, subtotal)
SELECT @seed_pedido_id, id, nombre, precio, 1, precio
FROM productos WHERE slug = 'note-tool-demo'
ON DUPLICATE KEY UPDATE subtotal = VALUES(subtotal);

INSERT INTO notas (titulo, contenido) VALUES
  ('Bienvenida a GrowLab', 'Nota de demostración para validar el CRUD de notas.'),
  ('Inventario inicial', 'Los productos semilla permiten probar stock, pedidos y administración.'),
  ('Mantenimiento', 'Revisar el inventario semanalmente y actualizar los estados de los pedidos.');
