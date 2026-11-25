import type { ProjectField } from "@/lib/types";

export const PROJECT_FIELDS: ProjectField[] = [
  "Engineering & Technology",
  "Artificial Intelligence",
  "Cybersecurity",
  "Health & Medicine",
  "Finance & Accounting",
  "Business & Management",
  "Agriculture & Environment",
  "Climate Science",
  "Energy & Sustainability",
  "Education",
  "Creative & Media",
  "Social Sciences & Humanities",
];

export const FIELD_COLORS: Record<ProjectField, string> = {
  "Engineering & Technology": "#FF7A30",
  "Artificial Intelligence": "#6C4CE0",
  Cybersecurity: "#161221",
  "Health & Medicine": "#D64545",
  "Finance & Accounting": "#1E9E5A",
  "Business & Management": "#4C6FE0",
  "Agriculture & Environment": "#8BA888",
  "Climate Science": "#2F8F7A",
  "Energy & Sustainability": "#FFB380",
  Education: "#9B80EC",
  "Creative & Media": "#E0548C",
  "Social Sciences & Humanities": "#C98A3D",
};

export const FIELD_BLURBS: Record<ProjectField, string> = {
  "Engineering & Technology": "Software, hardware, robotics, and systems engineering builds.",
  "Artificial Intelligence": "Machine learning, computer vision, NLP, and applied AI research.",
  Cybersecurity: "Security tooling, penetration testing, network defense, and cryptography.",
  "Health & Medicine": "Diagnostics, public health, nursing research, and medical devices.",
  "Finance & Accounting": "Audits, financial modeling, payments, and banking infrastructure.",
  "Business & Management": "Strategy, operations, marketing, entrepreneurship, and logistics.",
  "Agriculture & Environment": "Farm systems, conservation, supply chains, and natural resources.",
  "Climate Science": "Climate modeling, emissions research, and environmental policy.",
  "Energy & Sustainability": "Solar, off-grid power, waste management, and clean energy.",
  Education: "Curriculum design, learning platforms, and school administration.",
  "Creative & Media": "Design, film, animation, music, and audio production.",
  "Social Sciences & Humanities": "Sociology, law, psychology, history, and policy research.",
};
