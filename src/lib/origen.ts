/**
 * Origen de la visita (?ref=…): se guarda en el navegador en la primera visita y se manda
 * al registrarse, así en privado.registros se ve qué canal trajo cada cuenta.
 * Sin servicios externos: solo localStorage (si está bloqueado, simplemente no se guarda).
 */
const CLAVE = "prestum_ref";

export function guardarOrigen(ref: string | null) {
  if (!ref) return;
  const limpio = ref.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 60);
  if (!limpio) return;
  try {
    if (!localStorage.getItem(CLAVE)) localStorage.setItem(CLAVE, limpio);
  } catch {
    /* almacenamiento no disponible */
  }
}

export function leerOrigen(): string | undefined {
  try {
    return localStorage.getItem(CLAVE) ?? undefined;
  } catch {
    return undefined;
  }
}
