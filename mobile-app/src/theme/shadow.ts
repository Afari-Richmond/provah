import type { ViewStyle } from "react-native";

// Soft card shadow matching the Pinterest reference's card style. Platform
// gets both `shadow*` (iOS) and `elevation` (Android) since RN doesn't
// unify them.
export const cardShadow: ViewStyle = {
  shadowColor: "#161221",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 16,
  elevation: 3,
};
