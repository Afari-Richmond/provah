import { MarketingNav } from "@/components/marketing/MarketingNav";
import { WaitlistPopup } from "@/components/marketing/WaitlistPopup";
import { FooterFixes } from "@/components/marketing/FooterFixes";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Space+Grotesk:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap"
      />
      <style>{`
        .framer-jhrwe5-container { display: none !important; }
        #__framer-badge-container { display: none !important; }
        a, button, [role="button"], summary, select, label {
          cursor: pointer;
        }
      `}</style>
      <MarketingNav />
      {children}
      <WaitlistPopup />
      <FooterFixes />
    </>
  );
}
