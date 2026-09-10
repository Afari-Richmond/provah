import { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { PrimaryButton } from "@/components/PrimaryButton";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

const SLIDES: {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  tintMuted: string;
  title: string;
  subtitle: string;
}[] = [
  {
    icon: "flag-outline",
    tint: colors.primary,
    tintMuted: colors.primaryMuted,
    title: "Showcase Your Capstone Project",
    subtitle: "Give your final-year project a life beyond the grading panel.",
  },
  {
    icon: "search-outline",
    tint: colors.accent,
    tintMuted: colors.accentMuted,
    title: "Get Discovered by Industry",
    subtitle: "Professionals browse real student work looking for talent worth backing.",
  },
  {
    icon: "chatbubbles-outline",
    tint: colors.primary,
    tintMuted: colors.primaryMuted,
    title: "Connect Directly",
    subtitle: "Message interested professionals and turn a grade into a real opportunity.",
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const isLastSlide = index === SLIDES.length - 1;

  function goToRoleSelect() {
    navigation.replace("RoleSelect");
  }

  function handleNext() {
    if (isLastSlide) {
      goToRoleSelect();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  }

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(nextIndex);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipRow}>
        <Pressable onPress={goToRoleSelect} hitSlop={8}>
          <Text style={styles.skipLabel}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.illustration, { backgroundColor: item.tintMuted }]}>
              <Ionicons name={item.icon} size={72} color={item.tint} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <PrimaryButton label={isLastSlide ? "Get Started" : "Next"} onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  skipLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  slide: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  illustration: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  footer: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
});
