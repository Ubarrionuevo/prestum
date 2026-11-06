import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase";

/**
 * Dos usos:
 *  1) El panel, después de guardar: regenera SOLO la página del negocio (con el token del usuario).
 *  2) Cambio de precios: POST /api/revalidar?secret=<REVALIDATE_SECRET> regenera todo el sitio.
 *     Se puede disparar solo con un "Database Webhook" de Supabase sobre las tablas planes/ajustes.
 */
export async function POST(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret) {
    if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
      return new Response("no autorizado", { status: 401 });
    }
    revalidatePath("/", "layout");
    return Response.json({ ok: true, todo: true });
  }

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return new Response("no autorizado", { status: 401 });
  const sb = getServerSupabase(token);
  if (!sb) return new Response("sin configurar", { status: 503 });

  const { data: userData } = await sb.auth.getUser(token);
  const uid = userData.user?.id;
  if (!uid) return new Response("no autorizado", { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { negocio_id?: string };
  if (!body.negocio_id) return new Response("falta negocio_id", { status: 400 });
  // Solo el dueño de esa sucursal puede regenerarla.
  const { data: rol } = await sb.rpc("rol_en_negocio", { p_negocio: body.negocio_id });
  if (rol !== "dueno") return new Response("no autorizado", { status: 403 });
  const { data } = await sb.from("negocios").select("slug").eq("id", body.negocio_id).maybeSingle();
  if (!data?.slug) return new Response("sin negocio", { status: 404 });

  revalidatePath(`/${data.slug}`);
  return Response.json({ ok: true });
}
