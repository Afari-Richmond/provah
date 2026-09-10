import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { TagChip } from "@/components/TagChip";
import { fetchStudentProfile } from "@/lib/api/profile";
import { mockProjects } from "@/lib/mocks/projects";
import type { StudentProfile } from "@/lib/types/user";

export function StudentProfileScreen() {
  const [profile, setProfile] = useState<StudentProfile | undefined>(undefined);

  useEffect(() => {
    fetchStudentProfile().then((response) => setProfile(response.data));
  }, []);

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={mockProjects.slice(0, profile.stats.projectCount)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.avatar} />
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.subtitle}>
              {profile.university} · {profile.fieldOfStudy}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.projectCount}</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.totalViews}</Text>
                <Text style={styles.statLabel}>Total Views</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.connections}</Text>
                <Text style={styles.statLabel}>Connections</Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              {profile.badges.map((badge) => (
                <TagChip key={badge} label={badge} />
              ))}
            </View>

            <Text style={styles.sectionLabel}>My Projects</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.projectRow}>
            <Text style={styles.projectTitle}>{item.title}</Text>
          </View>
        )}
      />
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
  listContent: {
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.xl,
    marginTop: spacing.lg,
  },
  statBlock: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.lg,
    justifyContent: "center",
  },
  sectionLabel: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.xl,
  },
  projectRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  projectTitle: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});
