import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/config/site";

export const metadata = buildMetadata({
  title: "Política de privacidad",
  brand: "Prestum Turnos",
  description: "Cómo Prestum Turnos trata los datos de negocios y de sus clientes.",
  path: "/legal/privacidad",
});

export default function PrivacidadPage() {
  return (
    <LegalPage
      titulo="Política de privacidad"
      actualizado="5 de noviembre de 2026"
      secciones={[
        ["Qué datos guardamos", "Del negocio: nombre, email, WhatsApp, servicios, horarios y medios de pago. De quien reserva: nombre, servicio, fecha, hora, medio de pago y una nota opcional. No pedimos datos de tarjetas."],
        ["Para qué los usamos", "Para que la página de reservas funcione, para mostrarle al negocio sus turnos y sus métricas, y para contactarte por temas de tu cuenta."],
        ["Con quién los compartimos", "Con nadie con fines comerciales. Usamos proveedores de infraestructura (alojamiento y base de datos) que procesan los datos solo para prestar el servicio."],
        ["Cuánto tiempo", "Los turnos se borran automáticamente a los 6 meses. Los datos de la cuenta se conservan mientras la cuenta esté activa."],
        ["Tus derechos", `Podés pedir acceso, corrección o eliminación de tus datos escribiendo a ${site.email}, conforme a la Ley 25.326 de Protección de Datos Personales.`],
      ]}
    />
  );
}
