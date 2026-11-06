/**
 * Normaliza un celular argentino al formato de WhatsApp (549 + área + número).
 * Acepta: "383 403-5119", "0383 154035119", "+54 9 383 4035119", "543834035119".
 * Devuelve null si no parece válido.
 */
export function normalizarWhatsApp(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("54")) {
    d = d.slice(2);
    if (d.startsWith("9")) d = d.slice(1);
  }
  if (d.startsWith("0")) d = d.slice(1);
  // Saca el "15" después del código de área (áreas de 2, 3 o 4 dígitos).
  if (d.length === 12) {
    for (const area of [2, 3, 4]) {
      if (d.slice(area, area + 2) === "15") {
        d = d.slice(0, area) + d.slice(area + 2);
        break;
      }
    }
  }
  if (d.length !== 10) {
    // Números de otros países: se aceptan tal cual si vienen con código internacional.
    const raw = input.replace(/\D/g, "");
    return input.trim().startsWith("+") && raw.length >= 10 && raw.length <= 15 ? raw : null;
  }
  return `549${d}`;
}
