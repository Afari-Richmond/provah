import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { getPersistedRole } from "@/lib/session";
import { useAuth } from "@/hooks/useAuth";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const MIN_SPLASH_MS = 900;

export function SplashScreen({ navigation }: Props) {
  const { setRole } = useAuth();

  useEffect(() => {
    let cancelled = false;

    async function resolveDestination() {
      const [role] = await Promise.all([
        getPersistedRole(),
        new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_MS)),
      ]);

      if (cancelled) return;

      if (role) {
        setRole(role);
        navigation.reset({
          index: 0,
          routes: [{ name: role === "student" ? "StudentApp" : "ProfessionalApp" }],
        });
      } else {
        navigation.replace("Onboarding");
      }
    }

    resolveDestination();
    return () => {
      cancelled = true;
    };
  }, [navigation, setRole]);

  return (
    <View style={styles.container}>
      <Text style={styles.wordmark}>Provah</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -0.5,
  },
});
