import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { PrimaryButton } from "@/components/PrimaryButton";

const STEPS = ["Project Visuals", "Documentation", "External Links", "Review & Submit"] as const;

// Frontend-first, mock-backed: submitting doesn't persist anywhere yet, just
// shows an in-place success state. TODO: wire to POST /api/v1/projects and
// presigned-upload endpoints once `server/` exists (see
// context/architecture.md Storage Model).
export function ProjectUploadScreen() {
  const [step, setStep] = useState(0);
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isLastStep = step === STEPS.length - 1;
  const percentComplete = Math.round(((step + 1) / STEPS.length) * 100);

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <Text style={styles.stepTitle}>Project submitted</Text>
          <Text style={styles.reviewText}>
            Your project is now visible in Discovery. (Mock-backed — nothing was actually
            uploaded yet.)
          </Text>
          <PrimaryButton
            label="Upload Another"
            variant="secondary"
            onPress={() => {
              setStep(0);
              setSubmitted(false);
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.step}>
          Step {step + 1} of {STEPS.length}
        </Text>
        <Text style={styles.percent}>{percentComplete}% Complete</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentComplete}%` }]} />
      </View>

      <View style={styles.content}>
        <Text style={styles.stepTitle}>{STEPS[step]}</Text>

        {step === 0 && (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>Cover image / demo video upload</Text>
          </View>
        )}

        {step === 1 && (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>Technical documentation (PDF) upload</Text>
          </View>
        )}

        {step === 2 && (
          <View style={styles.fieldGroup}>
            <View style={styles.field}>
              <Text style={styles.label}>GitHub Repository</Text>
              <TextInput
                style={styles.input}
                placeholder="https://github.com/username/repo"
                placeholderTextColor={colors.placeholder}
                autoCapitalize="none"
                value={githubUrl}
                onChangeText={setGithubUrl}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Live Demo / Portfolio</Text>
              <TextInput
                style={styles.input}
                placeholder="https://yourproject.com"
                placeholderTextColor={colors.placeholder}
                autoCapitalize="none"
                value={demoUrl}
                onChangeText={setDemoUrl}
              />
            </View>
          </View>
        )}

        {step === 3 && (
          <Text style={styles.reviewText}>
            Review your project details, then submit. This will appear in Discovery once
            submitted.
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        {step > 0 && (
          <PrimaryButton label="Back" variant="secondary" onPress={() => setStep(step - 1)} />
        )}
        <PrimaryButton
          label={isLastStep ? "Submit Project" : "Continue"}
          onPress={() => {
            if (isLastStep) {
              setSubmitted(true);
            } else {
              setStep(step + 1);
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  step: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  percent: {
    fontSize: 13,
    color: colors.placeholder,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: radii.pill,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  successContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
    gap: spacing.md,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  placeholderBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  fieldGroup: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
  },
  reviewText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.lg,
  },
});
