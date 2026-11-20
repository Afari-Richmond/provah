import Link from "next/link";

export function Logo({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 font-(family-name:--font-unbounded) text-xl font-extrabold text-[var(--color-ink)]"
    >
      Provah
      <span className="mb-3 h-[6px] w-[6px] rounded-full bg-[var(--color-accent)]" />
    </Link>
  );
}
