/**
 * Visual direction from the user's Pinterest reference
 * (https://www.pinterest.com/pin/827325394087592648/, "E-Study Online
 * Learning Mobile App - Minimal EdTech UI"): purple/orange on white, bold
 * rounded headlines, icon-badge cards with soft shadows, pill category
 * chips (dark filled active / plain inactive). Adapted for Provah's own
 * content, not copied verbatim. Formalizes what `context/ui-context.md`
 * previously flagged as "not yet pulled from FlutterFlow" — this Pinterest
 * pin is now the active style reference, per explicit user direction.
 */
export const colors = {
  background: "#FFFFFF",
  surface: "#F6F4FC",
  surfaceMuted: "#F1F1F4",
  border: "#ECEAF5",
  textPrimary: "#161221",
  textSecondary: "#75717E",
  placeholder: "#A6A2AF",

  primary: "#6C4CE0",
  primaryMuted: "#EFE9FD",
  accent: "#FF7A30",
  accentMuted: "#FFEBDC",

  chipActiveBg: "#161221",
  chipActiveText: "#FFFFFF",

  progressTrack: "#EFEDF5",
  success: "#1E9E5A",
  successMuted: "#E3F6EB",
  danger: "#D64545",
  dangerMuted: "#FCE9E9",
  overlay: "rgba(22, 18, 33, 0.45)",
};

export const badgeColors = [colors.primary, colors.accent];
