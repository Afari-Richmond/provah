export type UserRole = "student" | "professional";

export type StudentProfile = {
  id: string;
  role: "student";
  name: string;
  university: string;
  fieldOfStudy: string;
  avatarUrl?: string;
  verified: boolean;
  badges: string[];
  stats: {
    projectCount: number;
    totalViews: number;
    connections: number;
  };
};

export type ProfessionalProfile = {
  id: string;
  role: "professional";
  name: string;
  title: string;
  company: string;
  location?: string;
  avatarUrl?: string;
  areasOfInterest: string[];
  stats: {
    rated: number;
    connects: number;
    interests: number;
  };
};

export type UserProfile = StudentProfile | ProfessionalProfile;
