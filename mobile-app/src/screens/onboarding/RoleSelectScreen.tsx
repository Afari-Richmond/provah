import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { cardShadow } from "@/theme/shadow";
import { IconBadge } from "@/components/IconBadge";
import { PrimaryButton } from "@/components/PrimaryButton";
import type { RootStackParamList } from "@/navigation/types";
import type { UserRole } from "@/lib/types/user";

type Props = NativeStackScreenProps<RootStackParamList, "RoleSelect">;

const ROLE_OPTIONS: {
  role: UserRole;
  title: string;
  subtitle: string;
  icon: "school-outline" | "briefcase-outline";
  color: string;
}[] = [
  {
    role: "student",
    title: "Student",
    subtitle: "I want to showcase my project",
    icon: "school-outline",
    color: colors.primary,
  },
  {
    role: "professional",
    title: "Industry Professional",
    subtitle: "I'm looking for innovative ideas",
    icon: "briefcase-outline",
    color: colors.accent,
  },
];

export function RoleSelectScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<UserRole | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Showcase Your Best Work</Text>
        <Text style={styles.subtitle}>
          Upload your capstone project and get discovered by industry leaders.
        </Text>

        <Text style={styles.sectionLabel}>I am a...</Text>
        <View style={styles.optionsList}>
          {ROLE_OPTIONS.map((option) => {
            const isSelected = selected === option.role;
            return (
              <Pressable
                key={option.role}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => setSelected(option.role)}
              >
                <IconBadge name={option.icon} color={option.color} />
                <View style={styles.optionTextGroup}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continue"
          disabled={!selected}
          onPress={() => {
            if (selected) {
              navigation.navigate("Auth", { role: selected });
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  optionsList: {
    gap: spacing.md,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.md,
    ...cardShadow,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  optionTextGroup: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  optionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    padding: spacing.lg,
  },
});
