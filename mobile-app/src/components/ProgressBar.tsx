import { StyleSheet, View } from "react-native";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/spacing";

export function ProgressBar({ progress, color = colors.accent }: { progress: number; color?: string }) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: colors.progressTrack,
    borderRadius: radii.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radii.pill,
  },
});
