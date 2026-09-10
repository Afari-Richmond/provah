import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { PrimaryButton } from "@/components/PrimaryButton";

/**
 * Bottom-sheet confirmation, styled after the user's Pinterest reference
 * (https://www.pinterest.com/pin/716916834477537954/, "Minimal Success
 * Confirmation UI"): dimmed backdrop, white sheet with rounded top corners,
 * a scalloped seal-badge icon, bold title, subtitle, and a full-width pill
 * dismiss button. Same component covers both success and error — error
 * swaps the badge to a danger-colored alert decagram, not a separate design.
 */
type Props = {
  visible: boolean;
  variant: "success" | "error";
  title: string;
  message: string;
  buttonLabel?: string;
  onDismiss: () => void;
};

export function FeedbackSheet({
  visible,
  variant,
  title,
  message,
  buttonLabel = "Done",
  onDismiss,
}: Props) {
  const isSuccess = variant === "success";
  const tint = isSuccess ? colors.success : colors.danger;
  const tintMuted = isSuccess ? colors.successMuted : colors.dangerMuted;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouchable} onPress={onDismiss} />
        <View style={styles.sheet}>
          <View style={[styles.badge, { backgroundColor: tintMuted }]}>
            <MaterialCommunityIcons
              name={isSuccess ? "check-decagram" : "alert-decagram"}
              size={48}
              color={tint}
            />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonWrap}>
            <PrimaryButton label={buttonLabel} onPress={onDismiss} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xl + 6,
    borderTopRightRadius: radii.xl + 6,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: "center",
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  buttonWrap: {
    width: "100%",
  },
});
