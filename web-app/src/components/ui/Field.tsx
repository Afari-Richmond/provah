import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, SelectHTMLAttributes, useId } from "react";

function Label({ children, hint, htmlFor }: { children: ReactNode; hint?: string; htmlFor: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <label
        htmlFor={htmlFor}
        className="font-(family-name:--font-space-mono) text-xs font-bold uppercase tracking-[0.05em] text-[var(--color-ink)]"
      >
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

// text-base (16px) is deliberate, not a default — anything smaller makes
// iOS Safari auto-zoom the viewport on focus.
const fieldClass =
  "w-full rounded-2xl border-2 border-[var(--color-ink)]/15 bg-white px-4 py-3 font-(family-name:--font-space-grotesk) text-base text-[var(--color-ink)] placeholder:text-black/30 outline-none transition-colors focus:border-[var(--color-primary)]";

export function TextField({
  label,
  hint,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div>
      <Label hint={hint} htmlFor={fieldId}>{label}</Label>
      <input id={fieldId} className={fieldClass} {...props} />
    </div>
  );
}

export function TextAreaField({
  label,
  hint,
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div>
      <Label hint={hint} htmlFor={fieldId}>{label}</Label>
      <textarea id={fieldId} className={`${fieldClass} min-h-[120px] resize-y`} {...props} />
    </div>
  );
}

export function SelectField({
  label,
  hint,
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div>
      <Label hint={hint} htmlFor={fieldId}>{label}</Label>
      <select id={fieldId} className={`${fieldClass} appearance-none`} {...props}>
        {children}
      </select>
    </div>
  );
}
