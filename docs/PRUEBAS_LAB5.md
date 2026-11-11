# Matriz de pruebas del Laboratorio #5

Las pruebas de API incluidas están en `backend/tests/api.test.js` y usan `supertest` con SQLite en memoria y un doble de `claude.service` para no consumir créditos.

| Caso | HTTP esperado | Archivo automatizado |
|---|---:|---|
| Crear dos notas | 201 | CRUD de notas |
| Listar notas | 200 | CRUD de notas |
| Buscar nota 99 | 404 | CRUD de notas |
| Crear nota con `{}` | 400 | CRUD de notas |
| Preguntar a IA (simulada) | 200 + uso | Consulta y resumen |
| Resumir nota existente (simulado) | 200 | Consulta y resumen |
| Resumir nota ausente | 404 sin llamar IA | Consulta y resumen |
| Preguntar con una letra | 400 sin llamar IA | Consulta y resumen |
| API key falsa con Claude real | 502 | **Prueba manual pendiente, requiere API key de ensayo** |
| Eliminar nota y volver a buscarla | 204 / 404 | CRUD de notas |
| Agotar stock | 409, sin modificaciones | Pruebas de pedido |
| Repetir `Idempotency-Key` | mismo código, descuento único | Pruebas de pedido |
| Comprar producto de genética disponible | 201 | Registro de pedido y actualización de inventario |
| Cancelar dos veces | stock restaurado una sola vez | Prueba administración |

**Capturas exigidas por el docente:** crear `docs/capturas/` y añadir imágenes de Swagger de los casos ★. No se incluyen capturas simuladas ni pruebas de uso de Claude real.

## Pasos para hacer las pruebas manuales desde Swagger

1. Arranca backend y frontend mediante `npm run dev`.
2. Abre `http://localhost:3000/api-docs`.
3. Crea una nota desde `POST /api/notas`.
4. Prueba `POST /api/ia/preguntar` con una pregunta entre 3 y 2000 caracteres.
5. Ejecuta `POST /api/notas/1/resumen`.
6. Guarda las capturas en `docs/capturas/`.
7. Para probar error Claude 401, usa una **clave incorrecta creada exclusivamente para la prueba**, reinicia el servidor, consulta la API y después restaura la clave válida.
8. Registra dos usos de tokens reales en el README. Nunca inventes consumos ni pegues API keys en capturas.

**Importante:** en este entorno de construcción no fue posible descargar paquetes desde npm por un error de red `EAI_AGAIN`. La instalación, pruebas de integración y compilación deben ejecutarse en una máquina con acceso al registro npm o en el flujo de GitHub Actions.
