import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfessionalDiscoveryScreen } from "@/screens/professional/ProfessionalDiscoveryScreen";
import { ProjectDetailScreen } from "@/screens/projects/ProjectDetailScreen";
import type { DiscoveryStackParamList } from "@/navigation/types";

const Stack = createNativeStackNavigator<DiscoveryStackParamList>();

export function DiscoveryStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Discovery" component={ProfessionalDiscoveryScreen} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
    </Stack.Navigator>
  );
}
