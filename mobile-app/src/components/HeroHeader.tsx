import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";

/**
 * Full-bleed colored header (extends behind the status bar, rounded bottom
 * corners), per the user's Pinterest reference
 * (https://www.pinterest.com/pin/1126251819341489551/, "Purple Accents" —
 * a construction/material-tracking app). Used on both role's home surfaces
 * (Student Home, Professional Discovery) for consistency, not just the one
 * screen asked about — a judgment call, see context/progress-tracker.md.
 */
export function HeroHeader({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.md }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: radii.xl + 6,
    borderBottomRightRadius: radii.xl + 6,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
