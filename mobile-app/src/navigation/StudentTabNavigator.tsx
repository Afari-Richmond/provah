import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeStackNavigator } from "@/navigation/HomeStackNavigator";
import { ProjectUploadScreen } from "@/screens/projects/ProjectUploadScreen";
import { StudentProfileScreen } from "@/screens/student/StudentProfileScreen";
import type { StudentTabParamList } from "@/navigation/types";

const Tab = createBottomTabNavigator<StudentTabParamList>();

export function StudentTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: "Home" }} />
      <Tab.Screen
        name="UploadTab"
        component={ProjectUploadScreen}
        options={{ title: "Upload" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={StudentProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
