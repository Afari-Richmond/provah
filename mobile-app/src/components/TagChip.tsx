import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function TagChip({ label, selected, onPress }: Props) {
  const content = (
    <>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.chip}>{content}</View>;
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  labelSelected: {
    color: colors.background,
  },
});
