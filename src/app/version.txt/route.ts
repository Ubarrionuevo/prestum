// Commit publicado en producción (lo usa la tarea de GitHub de IndexNow para saber que el deploy terminó).
// Se fija en el build: Vercel pasa VERCEL_GIT_COMMIT_SHA.
export const dynamic = "force-static";

export function GET() {
  return new Response(process.env.VERCEL_GIT_COMMIT_SHA ?? "local", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}
