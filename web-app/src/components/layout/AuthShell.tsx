import { ReactNode } from "react";
import Image from "next/image";
import { Logo } from "./Logo";
import { Eyebrow } from "@/components/ui/Badge";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  footer,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: full-bleed image */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/auth-hero.png"
          alt="Students collaborating on a capstone project"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <h2 className="font-(family-name:--font-unbounded) text-4xl font-bold leading-[1.15] tracking-[-0.5px] text-white">
            Your final year
            <br />
            project shouldn&apos;t
            <br />
            end with a grade.
          </h2>
          <p className="mt-4 max-w-sm font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-white/80">
            Provah connects student innovators with the industry
            professionals, mentors, and investors who can take their work
            further — free, always.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex flex-col px-6 py-8 sm:px-12 sm:py-10 lg:px-16">
        <Logo href="/" />

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 font-(family-name:--font-unbounded) text-[32px] font-bold leading-[1.15] tracking-[-0.5px] text-[var(--color-ink)]">
            {title}
          </h1>
          <p className="mt-3 font-(family-name:--font-space-grotesk) text-[15px] leading-7 text-black/60">
            {subtitle}
          </p>

          <div className="mt-8">{children}</div>
        </div>

        <div className="mx-auto w-full max-w-sm">{footer}</div>
      </div>
    </div>
  );
}
