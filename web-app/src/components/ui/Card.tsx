import { HTMLAttributes, ReactNode } from "react";

export function Card({
  className = "",
  children,
  shadow = "dark",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  shadow?: "dark" | "white" | "none";
}) {
  const shadowClass =
    shadow === "dark" ? "pv-shadow-sm" : shadow === "white" ? "pv-shadow-white" : "";
  return (
    <div
      className={`pv-border ${shadowClass} rounded-[20px] bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
