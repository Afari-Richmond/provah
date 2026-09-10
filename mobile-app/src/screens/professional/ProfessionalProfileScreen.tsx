import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { TagChip } from "@/components/TagChip";
import { fetchProfessionalProfile } from "@/lib/api/profile";
import { mockProjects } from "@/lib/mocks/projects";
import type { ProfessionalProfile } from "@/lib/types/user";

// No verification/trust badge for this role yet; flagged as a product gap
// in context/project-overview.md, not something to invent here.
export function ProfessionalProfileScreen() {
  const [profile, setProfile] = useState<ProfessionalProfile | undefined>(undefined);

  useEffect(() => {
    fetchProfessionalProfile().then((response) => setProfile(response.data));
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
        data={mockProjects.slice(0, 2)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.avatar} />
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.subtitle}>
              {profile.title} · {profile.company}
            </Text>
            {profile.location && <Text style={styles.location}>{profile.location}</Text>}

            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.rated}</Text>
                <Text style={styles.statLabel}>Rated</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.connects}</Text>
                <Text style={styles.statLabel}>Connects</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.interests}</Text>
                <Text style={styles.statLabel}>Interests</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>Areas of Interest</Text>
            <View style={styles.chipRow}>
              {profile.areasOfInterest.map((area) => (
                <TagChip key={area} label={area} />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Saved Projects</Text>
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
  location: {
    fontSize: 12,
    color: colors.placeholder,
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
  sectionLabel: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    alignSelf: "flex-start",
  },
  projectRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  projectTitle: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});
