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
  url: string;
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
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  rejectionReason?: string;
};

export type Role = "student" | "professional" | "admin";

export type Profile = {
  id: string;
  role: Role;
  name: string;
  avatarUrl?: string | null;
  bio: string;
  verified: boolean;
  badges: string[];
  university?: string | null;
  fieldOfStudy?: string | null;
  title?: string | null;
  company?: string | null;
  location?: string | null;
  areasOfInterest: string[];
  createdAt: string;
};

export type Conversation = {
  id: string;
  projectId: string;
  projectTitle: string;
  counterpartId: string;
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
