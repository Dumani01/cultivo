# GrowLab Store

Tienda full stack con React, Express y MySQL. El backend ya no usa SQLite ni Docker.

## Requisitos

- Node.js 20+
- MySQL 8+ instalado y ejecutándose como servicio local o remoto
- npm

## Configuración local

1. Crea la base de datos y un usuario con permisos sobre ella:

```sql
CREATE DATABASE growlab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Instala dependencias y copia la configuración:

```powershell
npm install
Copy-Item .env.example .env
```

3. Configura `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER` y `MYSQL_PASSWORD` en `.env`. También establece `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET`.

Al iniciar, el backend crea las tablas InnoDB, índices y el catálogo inicial automáticamente. El esquema equivalente está en [docs/SCHEMA_MYSQL.sql](./docs/SCHEMA_MYSQL.sql).

## Ejecutar

```powershell
npm run dev
```

La tienda queda en `http://localhost:5173`, la API en `http://localhost:3000` y Swagger en `http://localhost:3000/api-docs`.

```powershell
npm test
npm run build
npm start
```

Las pruebas de integración usan MySQL cuando se define `MYSQL_TEST_DATABASE`; si no, quedan omitidas para no crear una base de datos de prueba accidentalmente.

## Migración aplicada

- `better-sqlite3` fue reemplazado por `mysql2`.
- El acceso a datos usa pool de conexiones y transacciones async.
- Los pedidos bloquean filas de inventario con `SELECT ... FOR UPDATE` antes de descontar stock.
- La siembra es idempotente (`INSERT IGNORE`) y conserva pedidos/notas existentes en MySQL.
- Se eliminaron Dockerfile y `docker-compose.yml` del flujo del proyecto.
