import Link from "next/link";

/** Logo Prestum + nombre del producto (ej: "Prestum" + "Turnos"). */
export function Logo({ brandName, href = "/", light = false }: { brandName: string; href?: string; light?: boolean }) {
  const [first, ...rest] = brandName.split(" ");
  return (
    <Link href={href} className="flex flex-none items-center gap-2 whitespace-nowrap text-base font-bold sm:text-lg" aria-label={brandName}>
      <img src="/icon.svg" alt="" width={30} height={30} />
      <span className={light ? "text-white" : "text-brand-900"}>
        {first}
        {rest.length > 0 && <span className={light ? "font-semibold text-brand-100" : "font-semibold text-brand-600"}> {rest.join(" ")}</span>}
      </span>
    </Link>
  );
}
