export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <span
      className="relative inline-block shrink-0"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <span className="absolute inset-0 rounded-full border-[2.5px] border-current opacity-20" />
      <span className="absolute inset-0 animate-spin rounded-full border-[2.5px] border-transparent border-t-current" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon.png"
        alt=""
        className="absolute inset-0 m-auto rounded-full"
        style={{ width: size * 0.56, height: size * 0.56 }}
      />
    </span>
  );
}

export function FullscreenSpinner() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center py-20">
      <Spinner size={40} />
    </div>
  );
}
