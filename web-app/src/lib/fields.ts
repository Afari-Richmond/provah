import type { ProjectField } from "@/lib/types";

export const PROJECT_FIELDS: ProjectField[] = [
  "Engineering & Technology",
  "Health & Medicine",
  "Finance & Technology",
  "Agriculture & Agritech",
  "Energy & Sustainability",
  "Education & EdTech",
  "Creative & Media",
  "Business & Social Impact",
];

export const FIELD_COLORS: Record<ProjectField, string> = {
  "Engineering & Technology": "#FF7A30",
  "Health & Medicine": "#6C4CE0",
  "Finance & Technology": "#161221",
  "Agriculture & Agritech": "#1E9E5A",
  "Energy & Sustainability": "#FFB380",
  "Education & EdTech": "#9B80EC",
  "Creative & Media": "#D64545",
  "Business & Social Impact": "#4C6FE0",
};

export const FIELD_BLURBS: Record<ProjectField, string> = {
  "Engineering & Technology": "Embedded systems, full-stack software, hardware builds, robotics.",
  "Health & Medicine": "Health tech, diagnostics, public health tools, medical devices.",
  "Finance & Technology": "Fintech, payments, banking infrastructure, financial inclusion.",
  "Agriculture & Agritech": "Farm tech, supply chain tools, irrigation, agri-fintech.",
  "Energy & Sustainability": "Solar, off-grid power, waste management, climate tech.",
  "Education & EdTech": "Learning platforms, tutoring tools, school administration systems.",
  "Creative & Media": "Design tools, film and animation tech, music and audio software.",
  "Business & Social Impact": "Nonprofits tech, civic platforms, logistics, operations tooling.",
};
