import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
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
          <Text style={styles.stat}>{project.stats.views} views</Text>
          <Text style={styles.stat}>{project.stats.likes} likes</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 2,
    backgroundColor: colors.surface,
  },
  body: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  stat: {
    color: colors.placeholder,
    fontSize: 12,
  },
});
