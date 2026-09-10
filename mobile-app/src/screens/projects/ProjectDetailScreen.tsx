import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { TagChip } from "@/components/TagChip";
import { PrimaryButton } from "@/components/PrimaryButton";
import { fetchProjectById } from "@/lib/api/projects";
import type { Project } from "@/lib/types/project";

// Shared between the Student (HomeStack) and Professional (DiscoveryStack)
// navigators, both of which declare an identically-shaped `ProjectDetail`
// route (see navigation/types.ts) — typed loosely here so this screen isn't
// coupled to either navigator's full param list.
type Props = {
  route: { params: { projectId: string } };
};
type Tab = "problem" | "solution";

export function ProjectDetailScreen({ route }: Props) {
  const { projectId } = route.params;
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("problem");

  useEffect(() => {
    fetchProjectById(projectId).then((response) => setProject(response.data));
  }, [projectId]);

  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <Image source={{ uri: project.imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.byline}>{project.university}</Text>

          <View style={styles.statsRow}>
            <Text style={styles.stat}>{project.stats.views} views</Text>
            <Text style={styles.stat}>{project.stats.likes} likes</Text>
            <Text style={styles.stat}>{project.stats.comments} comments</Text>
          </View>

          <View style={styles.tabs}>
            <Text
              style={[styles.tabLabel, tab === "problem" && styles.tabLabelActive]}
              onPress={() => setTab("problem")}
            >
              The Problem
            </Text>
            <Text
              style={[styles.tabLabel, tab === "solution" && styles.tabLabelActive]}
              onPress={() => setTab("solution")}
            >
              The Solution
            </Text>
          </View>
          <Text style={styles.body}>{tab === "problem" ? project.problem : project.solution}</Text>

          <Text style={styles.sectionLabel}>Tech Stack</Text>
          <View style={styles.chipRow}>
            {project.techStack.map((tech) => (
              <TagChip key={tech} label={tech} />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Team</Text>
          <View style={styles.chipRow}>
            {project.team.map((member) => (
              <TagChip key={member.id} label={member.name} />
            ))}
          </View>

          {project.documents.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Documents</Text>
              {project.documents.map((doc) => (
                <View key={doc.id} style={styles.documentRow}>
                  <Text style={styles.documentLabel}>{doc.label}</Text>
                  {doc.sizeLabel && <Text style={styles.documentMeta}>{doc.sizeLabel}</Text>}
                </View>
              ))}
            </>
          )}

          <View style={styles.ctaRow}>
            {/* Non-functional: "Express Interest" behavior is undefined, see
                context/progress-tracker.md Open Questions. Flagged here rather
                than silently wiring fake behavior, same pattern as Laundria's
                chrome-only Account menu rows. */}
            <PrimaryButton label="Message Student" variant="secondary" onPress={() => {}} />
            <PrimaryButton label="Express Interest" onPress={() => {}} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    padding: spacing.lg,
    color: colors.textSecondary,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  byline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  stat: {
    fontSize: 12,
    color: colors.placeholder,
  },
  tabs: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    paddingBottom: spacing.sm,
  },
  tabLabelActive: {
    color: colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  documentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  documentLabel: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  documentMeta: {
    fontSize: 12,
    color: colors.placeholder,
  },
  ctaRow: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
});
