import { getCurrentProfile } from "@/lib/auth";
import { MarketingNavBar } from "@/components/marketing/MarketingNavBar";

export async function MarketingNav() {
  const profile = await getCurrentProfile();

  return (
    <div
      style={{
        position: "relative",
        zIndex: 20,
        width: "100%",
        background: "#fff",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div style={{ display: "flex", width: "100%", height: 5 }}>
        <div style={{ flex: 1, background: "#6C4CE0" }} />
        <div style={{ flex: 1, background: "#FF7A30" }} />
        <div style={{ flex: 1, background: "#161221" }} />
        <div style={{ flex: 1, background: "#9B80EC" }} />
        <div style={{ flex: 1, background: "#FFB380" }} />
      </div>
      <MarketingNavBar profile={profile} />
    </div>
  );
}
