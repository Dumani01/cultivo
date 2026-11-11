export async function api(path, options = {}) {
  const { body, headers, ...rest } = options;
  let response;
  try {
    response = await fetch(path, {
      credentials: 'same-origin',
      ...rest,
      headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(headers || {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error('No se puede conectar con la API. Verifica que el backend esté iniciado.');
  }
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error || `Error HTTP ${response.status}`;
    const details = data?.detalles?.map(d => `${d.campo}: ${d.mensaje}`).join(' · ');
    throw new Error(details ? `${message}. ${details}` : message);
  }
  return data;
}
export const colones = value => value == null ? 'Consultar' : `₡${Number(value).toLocaleString('es-CR')}`;
