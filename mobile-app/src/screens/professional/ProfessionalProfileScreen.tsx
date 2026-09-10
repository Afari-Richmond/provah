import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { cardShadow } from "@/theme/shadow";
import { TagChip } from "@/components/TagChip";
import { fetchProfessionalProfile } from "@/lib/api/profile";
import { mockProjects } from "@/lib/mocks/projects";
import type { ProfessionalProfile } from "@/lib/types/user";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
            </View>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.subtitle}>
              {profile.title} · {profile.company}
            </Text>
            {profile.location && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={13} color={colors.placeholder} />
                <Text style={styles.location}>{profile.location}</Text>
              </View>
            )}

            <View style={styles.statsCard}>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.rated}</Text>
                <Text style={styles.statLabel}>Rated</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.connects}</Text>
                <Text style={styles.statLabel}>Connects</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{profile.stats.interests}</Text>
                <Text style={styles.statLabel}>Interests</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>Areas of Interest</Text>
            <View style={styles.chipRow}>
              {profile.areasOfInterest.map((area, index) => (
                <TagChip key={area} label={area} tone={index % 2 === 0 ? "primary" : "accent"} />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Saved Projects</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.projectRow}>
            <Ionicons name="bookmark-outline" size={18} color={colors.accent} />
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
    backgroundColor: colors.accentMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  avatarText: {
    color: colors.accent,
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
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
  },
  location: {
    fontSize: 12,
    color: colors.placeholder,
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
  sectionLabel: {
    alignSelf: "flex-start",
    fontSize: 15,
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
