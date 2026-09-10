import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";

// Category filter pill: solid dark fill when active, plain text when not —
// matches the reference's "All / Design / Development / Marketing" row.
export function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      hitSlop={4}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  chipSelected: {
    backgroundColor: colors.chipActiveBg,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.chipActiveText,
  },
});
