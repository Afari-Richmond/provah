export function Avatar({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="pv-border flex shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-muted)] font-(family-name:--font-space-mono) font-bold text-[var(--color-primary)]"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
