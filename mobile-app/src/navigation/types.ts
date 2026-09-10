import type { UserRole } from "@/lib/types/user";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  RoleSelect: undefined;
  Auth: { role: UserRole };
  StudentApp: undefined;
  ProfessionalApp: undefined;
};

// Student: Home has its own nested stack so it can push into the shared
// ProjectFeed/ProjectDetail screens. Upload and Profile are self-contained
// (no push navigation) so they're mounted directly as tab screens.
export type HomeStackParamList = {
  Home: undefined;
  ProjectFeed: undefined;
  ProjectDetail: { projectId: string };
};

export type StudentTabParamList = {
  HomeTab: undefined;
  UploadTab: undefined;
  ProfileTab: undefined;
};

// Professional: Discovery has its own nested stack so it can push into the
// shared ProjectDetail screen. Profile is self-contained.
export type DiscoveryStackParamList = {
  Discovery: undefined;
  ProjectDetail: { projectId: string };
};

export type ProfessionalTabParamList = {
  DiscoveryTab: undefined;
  ProfileTab: undefined;
};
