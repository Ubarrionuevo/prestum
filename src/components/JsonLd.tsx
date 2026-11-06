/** Inyecta uno o varios bloques JSON-LD. Ignora valores nulos. */
export function JsonLd({ data }: { data: Array<Record<string, unknown> | null> }) {
  return (
    <>
      {data.filter(Boolean).map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify + escape de "<" para evitar cortar el <script>.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
