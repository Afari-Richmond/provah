import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { PrimaryButton } from "@/components/PrimaryButton";
import type { RootStackParamList } from "@/navigation/types";
import type { UserRole } from "@/lib/types/user";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

const ROLE_OPTIONS: { role: UserRole; title: string; subtitle: string }[] = [
  { role: "student", title: "Student", subtitle: "I want to showcase my project" },
  { role: "professional", title: "Industry Professional", subtitle: "I'm looking for innovative ideas" },
];

export function OnboardingScreen({ navigation }: Props) {
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
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
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
    gap: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
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
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  optionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
  },
});
