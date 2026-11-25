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

// Just the two primary brand colors, alternating — a 12-color rainbow of
// field dots read as noisy clutter rather than a meaningful signal.
export const FIELD_COLORS: Record<ProjectField, string> = {
  "Engineering & Technology": "#6C4CE0",
  "Artificial Intelligence": "#FF7A30",
  Cybersecurity: "#6C4CE0",
  "Health & Medicine": "#FF7A30",
  "Finance & Accounting": "#6C4CE0",
  "Business & Management": "#FF7A30",
  "Agriculture & Environment": "#6C4CE0",
  "Climate Science": "#FF7A30",
  "Energy & Sustainability": "#6C4CE0",
  Education: "#FF7A30",
  "Creative & Media": "#6C4CE0",
  "Social Sciences & Humanities": "#FF7A30",
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
