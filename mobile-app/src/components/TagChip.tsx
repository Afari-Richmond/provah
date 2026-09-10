import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";

// Tinted tag pill (tech stack, achievement badges, areas of interest) —
// distinct from FilterChip, which is the dark-active/plain-inactive style
// used for category filter rows.
export function TagChip({ label, tone = "primary" }: { label: string; tone?: "primary" | "accent" }) {
  const isAccent = tone === "accent";
  return (
    <View style={[styles.chip, { backgroundColor: isAccent ? colors.accentMuted : colors.primaryMuted }]}>
      <Text style={[styles.label, { color: isAccent ? colors.accent : colors.primary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
});
