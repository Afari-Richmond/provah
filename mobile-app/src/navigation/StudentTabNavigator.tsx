import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeStackNavigator } from "@/navigation/HomeStackNavigator";
import { ProjectUploadScreen } from "@/screens/projects/ProjectUploadScreen";
import { StudentProfileScreen } from "@/screens/student/StudentProfileScreen";
import { colors } from "@/theme/colors";
import type { StudentTabParamList } from "@/navigation/types";

const Tab = createBottomTabNavigator<StudentTabParamList>();

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

export function StudentTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { height: 64, paddingTop: 8, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="home-outline" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="UploadTab"
        component={ProjectUploadScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="add-circle-outline" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={StudentProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="person-outline" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
