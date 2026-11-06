import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { PRUEBA_DIAS } from "@/config/planes";

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
      actualizado="5 de noviembre de 2026"
      secciones={[
        ["El servicio", `Prestum Turnos es un servicio de ${site.name} que permite a negocios y profesionales publicar una página de reservas y recibir turnos de sus clientes.`],
        ["Cuenta", "Para usar el servicio creás una cuenta con un email, un WhatsApp y una contraseña. Sos responsable de mantener tu contraseña segura y de que los datos que cargás sean reales."],
        ["Prueba gratis y planes", `Los primeros ${PRUEBA_DIAS} días son gratis, con todas las funciones y sin tarjeta. Al terminar la prueba elegís un plan; si no lo activás, se bloquea el acceso al panel y la página de reservas se pausa, pero tus datos no se borran. Los precios se publican en pesos argentinos en la página de precios. El plan anual equivale a 2 meses gratis.`],
        ["Uso permitido", "No podés usar el servicio para actividades ilegales, para enviar spam ni para publicar contenido engañoso u ofensivo. Podemos suspender cuentas que incumplan estas reglas."],
        ["Turnos y pagos entre vos y tus clientes", "Prestum Turnos facilita la reserva, pero la relación comercial, el servicio prestado y los cobros son entre el negocio y su cliente."],
        ["Disponibilidad", "Hacemos lo posible para que el servicio funcione siempre, pero puede haber interrupciones por mantenimiento o causas ajenas."],
        ["Baja", `Podés dar de baja tu cuenta cuando quieras escribiendo a ${site.email}.`],
      ]}
    />
  );
}
