import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { FeedbackSheet } from "@/components/FeedbackSheet";

const STEPS = ["Project Visuals", "Documentation", "External Links", "Review & Submit"] as const;

// Frontend-first, mock-backed: submitting doesn't persist anywhere yet, just
// shows the success FeedbackSheet. TODO: wire to POST /api/v1/projects and
// presigned-upload endpoints once `server/` exists (see
// context/architecture.md Storage Model).
export function ProjectUploadScreen() {
  const [step, setStep] = useState(0);
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isLastStep = step === STEPS.length - 1;
  const progress = (step + 1) / STEPS.length;
  const percentComplete = Math.round(progress * 100);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.step}>
          Step {step + 1} of {STEPS.length}
        </Text>
        <Text style={styles.percent}>{percentComplete}% Complete</Text>
      </View>
      <View style={styles.progressWrap}>
        <ProgressBar progress={progress} />
      </View>

      <View style={styles.content}>
        <Text style={styles.stepTitle}>{STEPS[step]}</Text>

        {step === 0 && (
          <View style={styles.placeholderBox}>
            <Ionicons name="image-outline" size={28} color={colors.primary} />
            <Text style={styles.placeholderText}>Cover image / demo video upload</Text>
          </View>
        )}

        {step === 1 && (
          <View style={styles.placeholderBox}>
            <Ionicons name="document-text-outline" size={28} color={colors.primary} />
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
          <View style={styles.footerButton}>
            <PrimaryButton label="Back" variant="secondary" onPress={() => setStep(step - 1)} />
          </View>
        )}
        <View style={styles.footerButton}>
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
      </View>

      <FeedbackSheet
        visible={submitted}
        variant="success"
        title="Project submitted"
        message="Your project is now visible in Discovery. (Mock-backed — nothing was actually uploaded yet.)"
        buttonLabel="Done"
        onDismiss={() => {
          setSubmitted(false);
          setStep(0);
        }}
      />
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
  progressWrap: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  stepTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: spacing.lg,
  },
  placeholderBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
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
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.textPrimary,
  },
  reviewText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.lg,
  },
  footerButton: {
    flex: 1,
  },
});
