import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { radii, spacing } from "@/theme/spacing";
import { cardShadow } from "@/theme/shadow";
import { FilterChip } from "@/components/FilterChip";
import { ProjectCard } from "@/components/ProjectCard";
import { HeroHeader } from "@/components/HeroHeader";
import { listProjects } from "@/lib/api/projects";
import type { Project } from "@/lib/types/project";
import type { DiscoveryStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<DiscoveryStackParamList, "Discovery">;

const CATEGORIES = ["All", "Engineering", "Tech", "Health", "Social"];

export function ProfessionalDiscoveryScreen({ navigation }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    listProjects().then((response) => setProjects(response.data ?? []));
  }, []);

  const featured = projects.find((project) => project.tags.includes("Featured"));
  const filtered = projects.filter((project) => {
    const matchesQuery = project.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || project.field === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <HeroHeader>
        <Text style={styles.title}>Discover Projects</Text>
        <Text style={styles.subtitle}>Find student talent worth backing</Text>
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
      </HeroHeader>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
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

            {featured && (
              <View style={styles.featuredSection}>
                <Text style={styles.sectionLabel}>Featured Project</Text>
                <ProjectCard
                  project={featured}
                  onPress={() =>
                    navigation.navigate("ProjectDetail", { projectId: featured.id })
                  }
                />
              </View>
            )}

            <Text style={styles.sectionLabel}>Recent Submissions</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
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
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.background,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: colors.onPrimaryTextSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...cardShadow,
  },
  search: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  listContent: {
    padding: spacing.lg,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  featuredSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  cardWrap: {
    marginBottom: spacing.md,
  },
});
