import { MarketingNav } from "@/components/marketing/MarketingNav";
import { WaitlistPopup } from "@/components/marketing/WaitlistPopup";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .framer-jhrwe5-container { display: none !important; }
        #__framer-badge-container { display: none !important; }
      `}</style>
      <MarketingNav />
      {children}
      <WaitlistPopup />
    </>
  );
}
