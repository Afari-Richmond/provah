import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { cardShadow } from "@/theme/shadow";
import { IconBadge } from "@/components/IconBadge";
import { fetchStudentProfile } from "@/lib/api/profile";
import type { StudentProfile } from "@/lib/types/user";
import type { HomeStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function StudentHomeScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<StudentProfile | undefined>(undefined);

  useEffect(() => {
    fetchStudentProfile().then((response) => setProfile(response.data));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile ? getInitials(profile.name) : ""}</Text>
            </View>
            <View>
              <Text style={styles.greetingMeta}>Good Morning,</Text>
              <Text style={styles.greetingName}>{profile?.name.split(" ")[0] ?? "there"}</Text>
            </View>
          </View>
          <View style={styles.bellBadge}>
            <Ionicons name="notifications-outline" size={18} color={colors.background} />
          </View>
        </View>

        <Text style={styles.headline}>Let&rsquo;s Get Your Work Seen</Text>

        <View style={styles.statCard}>
          <IconBadge name="stats-chart-outline" color={colors.primary} />
          <View style={styles.statTextGroup}>
            <Text style={styles.statTitle}>{profile?.stats.totalViews ?? 0} views this week</Text>
            <Text style={styles.statSubtitle}>Across all your projects</Text>
          </View>
        </View>

        <View style={styles.quickAccessRow}>
          <Pressable
            style={styles.quickAccessCard}
            onPress={() => navigation.navigate("ProjectFeed")}
          >
            <IconBadge name="compass-outline" color={colors.primary} />
            <Text style={styles.quickAccessTitle}>Explore Projects</Text>
          </Pressable>
          <View style={styles.quickAccessCard}>
            <IconBadge name="people-outline" color={colors.accent} />
            <Text style={styles.quickAccessTitle}>Active Professionals</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Recent Activity</Text>
        <View style={styles.activityRow}>
          <IconBadge name="bookmark-outline" color={colors.accent} size="sm" />
          <Text style={styles.activityText}>Project bookmarked by a professional</Text>
          <Text style={styles.activityMeta}>3h ago</Text>
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
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  greetingMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  greetingName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  bellBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  headline: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginTop: spacing.md,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginTop: spacing.sm,
    ...cardShadow,
  },
  statTextGroup: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  quickAccessRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  quickAccessCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: spacing.sm,
    ...cardShadow,
  },
  quickAccessTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...cardShadow,
  },
  activityText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  activityMeta: {
    fontSize: 12,
    color: colors.placeholder,
  },
});
