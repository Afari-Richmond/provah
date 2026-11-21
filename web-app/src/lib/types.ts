export type ProjectStatus = "draft" | "pending_review" | "published" | "rejected";

export type ProjectField =
  | "Engineering"
  | "Health & Medicine"
  | "Finance & Technology";

export type TeamMember = {
  id: string;
  name: string;
};

export type ProjectDocument = {
  id: string;
  label: string;
  kind: "pdf" | "video" | "image";
};

export type Project = {
  id: string;
  title: string;
  field: ProjectField;
  status: ProjectStatus;
  problem: string;
  solution: string;
  techStack: string[];
  tags: string[];
  team: TeamMember[];
  githubUrl?: string;
  demoUrl?: string;
  documents: ProjectDocument[];
  imageUrl?: string;
  views: number;
  bookmarks: number;
  messages: number;
  createdAt: string;
  university: string;
  studentName: string;
  studentAvatar?: string;
  rejectionReason?: string;
};

export type StudentProfile = {
  id: string;
  name: string;
  university: string;
  fieldOfStudy: string;
  avatarUrl?: string;
  bio: string;
  verified: boolean;
  badges: string[];
};

export type ProfessionalProfile = {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatarUrl?: string;
  bio: string;
  areasOfInterest: string[];
  verified: boolean;
};

export type Conversation = {
  id: string;
  projectId: string;
  projectTitle: string;
  counterpartName: string;
  counterpartRole: "student" | "professional";
  counterpartAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: "me" | "them";
  body: string;
  createdAt: string;
};

export type NotificationType =
  | "project_approved"
  | "project_rejected"
  | "new_message"
  | "new_interest";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
};
