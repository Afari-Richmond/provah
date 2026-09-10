import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { cardShadow } from "@/theme/shadow";
import { TagChip } from "@/components/TagChip";
import { fetchStudentProfile } from "@/lib/api/profile";
import { mockProjects } from "@/lib/mocks/projects";
import type { StudentProfile } from "@/lib/types/user";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
            </View>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.subtitle}>
              {profile.university} · {profile.fieldOfStudy}
            </Text>

            <View style={styles.statsCard}>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.projectCount}</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.totalViews}</Text>
                <Text style={styles.statLabel}>Total Views</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.connections}</Text>
                <Text style={styles.statLabel}>Connections</Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              {profile.badges.map((badge, index) => (
                <TagChip key={badge} label={badge} tone={index % 2 === 0 ? "primary" : "accent"} />
              ))}
            </View>

            <Text style={styles.sectionLabel}>My Projects</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.projectRow}>
            <Ionicons name="folder-outline" size={18} color={colors.primary} />
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
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  avatarText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 22,
  },
  name: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    ...cardShadow,
  },
  statBlock: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
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
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.xl,
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    ...cardShadow,
  },
  projectTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
