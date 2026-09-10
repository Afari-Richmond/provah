import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StudentHomeScreen } from "@/screens/student/StudentHomeScreen";
import { ProjectFeedScreen } from "@/screens/projects/ProjectFeedScreen";
import { ProjectDetailScreen } from "@/screens/projects/ProjectDetailScreen";
import type { HomeStackParamList } from "@/navigation/types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={StudentHomeScreen} />
      <Stack.Screen name="ProjectFeed" component={ProjectFeedScreen} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
    </Stack.Navigator>
  );
}
