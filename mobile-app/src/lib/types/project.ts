export type ProjectTeamMember = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type ProjectDocument = {
  id: string;
  label: string;
  kind: "pdf" | "video";
  sizeLabel?: string;
};

export type ProjectLinks = {
  githubUrl?: string;
  demoUrl?: string;
};

export type Project = {
  id: string;
  title: string;
  university: string;
  field: string;
  imageUrl: string;
  problem: string;
  solution: string;
  techStack: string[];
  team: ProjectTeamMember[];
  documents: ProjectDocument[];
  links: ProjectLinks;
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  tags: string[];
};
