import type { Metadata } from "next";
import { Unbounded, Space_Mono, Space_Grotesk } from "next/font/google";
import { PopupHost } from "@/components/ui/PopupHost";
import "../globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Provah",
  description: "Where final-year capstone projects get discovered.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${unbounded.variable} ${spaceMono.variable} ${spaceGrotesk.variable} min-h-full flex flex-col bg-white antialiased`}
    >
      {children}
      <PopupHost />
    </div>
  );
}
