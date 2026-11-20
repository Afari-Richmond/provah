import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <label className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-ink)]">
        {children}
      </label>
      {hint && (
        <span className="font-(family-name:--font-space-grotesk) text-xs text-black/40">
          {hint}
        </span>
      )}
    </div>
  );
}

const fieldClass =
  "w-full rounded-2xl border-2 border-[var(--color-ink)]/15 bg-white px-4 py-3 font-(family-name:--font-space-grotesk) text-[15px] text-[var(--color-ink)] placeholder:text-black/30 outline-none transition-colors focus:border-[var(--color-primary)]";

export function TextField({
  label,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <input className={fieldClass} {...props} />
    </div>
  );
}

export function TextAreaField({
  label,
  hint,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <textarea className={`${fieldClass} min-h-[120px] resize-y`} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  hint,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <select className={`${fieldClass} appearance-none`} {...props}>
        {children}
      </select>
    </div>
  );
}
