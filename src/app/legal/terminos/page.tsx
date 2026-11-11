import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { TURNOS_GRATIS } from "@/config/planes";

export const metadata = buildMetadata({
  title: "Términos y condiciones",
  brand: "Prestum Turnos",
  description: "Términos y condiciones de uso de Prestum Turnos.",
  path: "/legal/terminos",
});

export default function TerminosPage() {
  return (
    <LegalPage
      titulo="Términos y condiciones"
      actualizado="11 de noviembre de 2026"
      secciones={[
        ["El servicio", `Prestum Turnos es un servicio de ${site.name} que permite a negocios y profesionales publicar una página de reservas y recibir turnos de sus clientes.`],
        ["Cuenta", "Para usar el servicio creás una cuenta con un email, un WhatsApp y una contraseña. Sos responsable de mantener tu contraseña segura y de que los datos que cargás sean reales."],
        ["Plan gratis y planes pagos", `El plan Gratis no tiene vencimiento ni pide tarjeta e incluye hasta ${TURNOS_GRATIS} turnos por mes con 1 profesional. El cupo se renueva cada mes calendario. Si necesitás más turnos o más profesionales, pasás a un plan pago (Básico o Premium), que se abona por mes y por adelantado; si no lo activás, la página de reservas deja de tomar turnos nuevos hasta el mes siguiente, pero tus datos no se borran. Los precios se publican en pesos argentinos en la página de precios y pueden actualizarse avisando con anticipación. Podés cambiar de plan o volver al Gratis cuando quieras.`],
        ["Uso permitido", "No podés usar el servicio para actividades ilegales, para enviar spam ni para publicar contenido engañoso u ofensivo. Podemos suspender cuentas que incumplan estas reglas."],
        ["Turnos y pagos entre vos y tus clientes", "Prestum Turnos facilita la reserva, pero la relación comercial, el servicio prestado y los cobros son entre el negocio y su cliente."],
        ["Disponibilidad", "Hacemos lo posible para que el servicio funcione siempre, pero puede haber interrupciones por mantenimiento o causas ajenas."],
        ["Baja", `Podés dar de baja tu cuenta cuando quieras escribiendo a ${site.email}.`],
      ]}
    />
  );
}
