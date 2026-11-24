import { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "dark";

const base =
  "pv-border inline-flex items-center justify-center gap-2 rounded-full font-(family-name:--font-space-mono) font-bold uppercase text-sm tracking-[0.03em] px-7 py-[15px] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--color-accent)] text-[var(--color-ink)] pv-shadow",
  secondary: "bg-white text-[var(--color-ink)] pv-shadow",
  dark: "bg-[var(--color-primary)] text-white pv-shadow",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  loading = false,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
  loading?: boolean;
}) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
}
