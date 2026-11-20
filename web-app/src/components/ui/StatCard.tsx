export function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="pv-border rounded-[20px] bg-[var(--color-surface)] px-5 py-6 text-center">
      <div className="font-(family-name:--font-unbounded) text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
        {value}
      </div>
      <div className="mt-1 font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.03em] text-black/50">
        {label}
      </div>
    </div>
  );
}
