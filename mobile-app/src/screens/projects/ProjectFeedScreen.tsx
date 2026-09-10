import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { ProjectCard } from "@/components/ProjectCard";
import { FilterChip } from "@/components/FilterChip";
import { listProjects } from "@/lib/api/projects";
import type { Project } from "@/lib/types/project";
import type { HomeStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "ProjectFeed">;

const CATEGORIES = ["All", "Engineering", "Tech", "Health", "Social"];

export function ProjectFeedScreen({ navigation }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const { width } = useWindowDimensions();
  const cardWidth = (width - spacing.lg * 2 - spacing.md) / 2;

  useEffect(() => {
    listProjects().then((response) => setProjects(response.data ?? []));
  }, []);

  const filtered = projects.filter((project) => {
    const matchesQuery = project.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || project.field === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Projects</Text>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={colors.placeholder} />
          <TextInput
            style={styles.search}
            placeholder="Search by keyword, field, or university"
            placeholderTextColor={colors.placeholder}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <View style={styles.chipRow}>
          {CATEGORIES.map((item) => (
            <FilterChip
              key={item}
              label={item}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
        </View>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}>
            <ProjectCard
              project={item}
              onPress={() => navigation.navigate("ProjectDetail", { projectId: item.id })}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: spacing.sm,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  search: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  row: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
});
