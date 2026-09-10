import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SplashScreen } from "@/screens/onboarding/SplashScreen";
import { OnboardingScreen } from "@/screens/onboarding/OnboardingScreen";
import { AuthScreen } from "@/screens/auth/AuthScreen";
import { StudentTabNavigator } from "@/navigation/StudentTabNavigator";
import { ProfessionalTabNavigator } from "@/navigation/ProfessionalTabNavigator";
import type { RootStackParamList } from "@/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="StudentApp" component={StudentTabNavigator} />
      <Stack.Screen name="ProfessionalApp" component={ProfessionalTabNavigator} />
    </Stack.Navigator>
  );
}
