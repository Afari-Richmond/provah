import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { cardShadow } from "@/theme/shadow";
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
            <View style={styles.stat}>
              <Ionicons name="eye-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.statText}>{project.stats.views} views</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="heart-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.statText}>{project.stats.likes} likes</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="chatbubble-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.statText}>{project.stats.comments} comments</Text>
            </View>
          </View>

          <View style={styles.tabs}>
            <Pressable
              style={[styles.tabPill, tab === "problem" && styles.tabPillActive]}
              onPress={() => setTab("problem")}
            >
              <Text style={[styles.tabPillLabel, tab === "problem" && styles.tabPillLabelActive]}>
                The Problem
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tabPill, tab === "solution" && styles.tabPillActive]}
              onPress={() => setTab("solution")}
            >
              <Text
                style={[styles.tabPillLabel, tab === "solution" && styles.tabPillLabelActive]}
              >
                The Solution
              </Text>
            </Pressable>
          </View>
          <Text style={styles.body}>{tab === "problem" ? project.problem : project.solution}</Text>

          <Text style={styles.sectionLabel}>Tech Stack</Text>
          <View style={styles.chipRow}>
            {project.techStack.map((tech, index) => (
              <TagChip key={tech} label={tech} tone={index % 2 === 0 ? "primary" : "accent"} />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Team</Text>
          <View style={styles.teamRow}>
            {project.team.map((member) => (
              <View key={member.id} style={styles.teamMember}>
                <View style={styles.teamAvatar}>
                  <Text style={styles.teamAvatarText}>{member.name[0]}</Text>
                </View>
                <Text style={styles.teamName}>{member.name}</Text>
              </View>
            ))}
          </View>

          {project.documents.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Documents</Text>
              {project.documents.map((doc) => (
                <View key={doc.id} style={styles.documentRow}>
                  <Ionicons
                    name={doc.kind === "video" ? "videocam-outline" : "document-text-outline"}
                    size={18}
                    color={colors.primary}
                  />
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
            <View style={styles.ctaButton}>
              <PrimaryButton label="Message" variant="secondary" onPress={() => {}} />
            </View>
            <View style={styles.ctaButton}>
              <PrimaryButton label="Express Interest" onPress={() => {}} />
            </View>
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
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    padding: 4,
  },
  tabPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  tabPillActive: {
    backgroundColor: colors.background,
    ...cardShadow,
  },
  tabPillLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  tabPillLabelActive: {
    color: colors.primary,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  sectionLabel: {
    fontSize: 15,
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
  teamRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  teamMember: {
    alignItems: "center",
    gap: 4,
    width: 64,
  },
  teamAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  teamAvatarText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  teamName: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
  },
  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  documentLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  documentMeta: {
    fontSize: 12,
    color: colors.placeholder,
  },
  ctaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  ctaButton: {
    flex: 1,
  },
});
