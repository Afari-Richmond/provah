import type { ProfessionalProfile, StudentProfile } from "@/lib/types/user";

export const mockStudent: StudentProfile = {
  id: "u1",
  role: "student",
  name: "David Owusu",
  university: "Kwame Nkrumah University of Science and Technology",
  fieldOfStudy: "Computer Engineering",
  verified: true,
  badges: ["Top Project 2023", "Engineering Week Winner", "Verified Student"],
  stats: {
    projectCount: 3,
    totalViews: 1892,
    connections: 46,
  },
};

export const mockProfessional: ProfessionalProfile = {
  id: "u2",
  role: "professional",
  name: "Sarah Mensah",
  title: "Product Lead",
  company: "AfricaTech Ventures",
  location: "Accra, Ghana",
  areasOfInterest: ["AgriTech", "FinTech", "Clean Energy"],
  stats: {
    rated: 4.2,
    connects: 128,
    interests: 15,
  },
};
