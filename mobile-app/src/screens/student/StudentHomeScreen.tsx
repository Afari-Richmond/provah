import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { fetchStudentProfile } from "@/lib/api/profile";
import type { StudentProfile } from "@/lib/types/user";
import type { HomeStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

export function StudentHomeScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<StudentProfile | undefined>(undefined);

  useEffect(() => {
    fetchStudentProfile().then((response) => setProfile(response.data));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Hello, {profile?.name.split(" ")[0] ?? "there"}</Text>
        <Text style={styles.subtitle}>Final Year, Engineering</Text>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Your project has {profile?.stats.totalViews ?? 0} views this week</Text>
        </View>

        <View style={styles.quickAccessRow}>
          <Pressable
            style={styles.quickAccessCard}
            onPress={() => navigation.navigate("ProjectFeed")}
          >
            <Text style={styles.quickAccessTitle}>Explore Projects</Text>
          </Pressable>
          <View style={styles.quickAccessCard}>
            <Text style={styles.quickAccessTitle}>Active Professionals</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Recent Activity</Text>
        <View style={styles.activityRow}>
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
  greeting: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  quickAccessRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  quickAccessCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  activityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  activityText: {
    fontSize: 13,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  activityMeta: {
    fontSize: 12,
    color: colors.placeholder,
  },
});
