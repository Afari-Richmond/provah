import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radii } from "@/theme/spacing";

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  color?: string;
  iconColor?: string;
  size?: "sm" | "md";
};

export function IconBadge({ name, color = colors.primary, iconColor = colors.background, size = "md" }: Props) {
  const boxSize = size === "sm" ? 32 : 44;
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color, width: boxSize, height: boxSize, borderRadius: radii.md },
      ]}
    >
      <Ionicons name={name} size={size === "sm" ? 16 : 20} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
  },
});
