import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserRole } from "@/lib/types/user";

/**
 * No real auth yet (see context/architecture.md Open Architecture Questions).
 * This just remembers "the user picked a role and completed the mock Sign In
 * once" across app restarts, so returning users skip onboarding/role-select/
 * auth and land straight back in their app — not a real session/token.
 */
const SESSION_KEY = "provah.session.role";

export async function getPersistedRole(): Promise<UserRole | null> {
  const value = await AsyncStorage.getItem(SESSION_KEY);
  return value === "student" || value === "professional" ? value : null;
}

export async function persistRole(role: UserRole): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, role);
}

export async function clearPersistedRole(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
