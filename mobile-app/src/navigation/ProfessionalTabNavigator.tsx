import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { DiscoveryStackNavigator } from "@/navigation/DiscoveryStackNavigator";
import { ProfessionalProfileScreen } from "@/screens/professional/ProfessionalProfileScreen";
import { colors } from "@/theme/colors";
import type { ProfessionalTabParamList } from "@/navigation/types";

const Tab = createBottomTabNavigator<ProfessionalTabParamList>();

function TabIcon({ name, focused }: { name: keyof typeof Ionicons.glyphMap; focused: boolean }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? colors.primary : "transparent",
      }}
    >
      <Ionicons name={name} size={20} color={focused ? colors.background : colors.placeholder} />
    </View>
  );
}

export function ProfessionalTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { height: 64, paddingTop: 8, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="DiscoveryTab"
        component={DiscoveryStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="compass-outline" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfessionalProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="person-outline" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
