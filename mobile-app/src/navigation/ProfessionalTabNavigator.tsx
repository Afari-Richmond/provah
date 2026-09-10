import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DiscoveryStackNavigator } from "@/navigation/DiscoveryStackNavigator";
import { ProfessionalProfileScreen } from "@/screens/professional/ProfessionalProfileScreen";
import type { ProfessionalTabParamList } from "@/navigation/types";

const Tab = createBottomTabNavigator<ProfessionalTabParamList>();

export function ProfessionalTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="DiscoveryTab"
        component={DiscoveryStackNavigator}
        options={{ title: "Discovery" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfessionalProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
