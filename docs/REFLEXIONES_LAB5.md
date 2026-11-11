# Preguntas de reflexión — Laboratorio 5

## 1. ¿Por qué la API key no puede estar en el frontend?

Todo código JavaScript distribuido al navegador puede inspeccionarse mediante DevTools y cualquier variable incorporada al bundle o visible en las solicitudes de red puede recuperarse. Si la clave de Anthropic viajara al navegador, terceros podrían consumir créditos de la cuenta. Por eso `claude.service.js` lee `ANTHROPIC_API_KEY` exclusivamente desde el proceso Node.js y el frontend solo consume endpoints propios.

## 2. ¿Qué responde nuestra API cuando Claude devuelve 401?

El `errorHandler` transforma el 401 de Anthropic a `502` con `IA_NO_DISPONIBLE` sin reenviar el detalle del servicio externo. Ese 401 significa que falló la autenticación **de nuestro backend con Anthropic**, no la identidad del visitante en GrowLab.

## 3. ¿Cuál es la diferencia entre `system` y `messages`?

`system` establece el rol, ámbito, idioma y las restricciones de la respuesta, mientras `messages` contiene el contenido específico sobre el que se trabaja. Ejemplo: el `system` de resumen pide tres viñetas en español; `messages` lleva el texto de la nota individual seleccionada.

## 4. Consumo de dos llamadas (`input_tokens` y `output_tokens`)

**Pendiente de anotar después de dos llamadas reales con una API key válida.** Las pruebas automatizadas usan valores simulados y no se deben presentar como consumo real. `max_tokens` permite acotar la longitud máxima de la respuesta (600 para GrowLab); también se controla el gasto con Zod y `express-rate-limit`.

| Llamada real | input_tokens | output_tokens |
|---|---|---|
| `POST /api/ia/preguntar` | Pendiente | Pendiente |
| `POST /api/notas/:id/resumen` | Pendiente | Pendiente |

## 5. ¿Qué sucedería si no validáramos el body?

Una solicitud vacía o gigante consumiría recursos y créditos de IA; además una entrada inesperada podría causar fallos de tipo o resultados incoherentes. Validamos tipo y longitud con Zod antes de invocar a Claude. También limitamos el número de peticiones por minuto.

## 6. ¿Qué conflicto de Git hubo al integrar las ramas?

**Pendiente de completar por los dos integrantes de la pareja después de realizar los pull requests reales.** No se debe inventar un conflicto o revisión que no haya ocurrido. Para producir una respuesta auténtica, documentar archivos en conflicto, decisión del equipo, resolución y prueba posterior.
