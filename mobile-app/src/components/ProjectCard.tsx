import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { cardShadow } from "@/theme/shadow";
import type { Project } from "@/lib/types/project";

export function ProjectCard({ project, onPress }: { project: Project; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: project.imageUrl }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {project.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {project.university}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="eye-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.statText}>{project.stats.views}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="heart-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.statText}>{project.stats.likes}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radii.xl,
    overflow: "hidden",
    ...cardShadow,
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 2,
    backgroundColor: colors.surface,
  },
  body: {
    padding: spacing.md,
    gap: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
});
