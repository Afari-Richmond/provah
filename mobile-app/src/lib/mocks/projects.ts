import type { Project } from "@/lib/types/project";

export const mockProjects: Project[] = [
  {
    id: "p1",
    title: "Autonomous Crop Monitoring Drone with AI Analysis",
    university: "Kwame Nkrumah University of Science and Technology",
    field: "Engineering",
    imageUrl: "https://picsum.photos/seed/p1/600/400",
    problem:
      "Smallholder farmers lack affordable tools to detect crop disease and irrigation problems early enough to act on them.",
    solution:
      "An autonomous drone captures multispectral imagery over a field and an onboard model flags stressed crop regions in real time, presenting a simple map to the farmer.",
    techStack: ["Python", "TensorFlow", "OpenCV", "Flutter"],
    team: [
      { id: "t1", name: "Kwame B." },
      { id: "t2", name: "Nana Y." },
    ],
    documents: [
      { id: "d1", label: "Technical Documentation.pdf", kind: "pdf", sizeLabel: "2.3 MB" },
      { id: "d2", label: "Demo Video Presentation.mp4", kind: "video", sizeLabel: "35.1 MB" },
    ],
    links: {
      githubUrl: "https://github.com/example/crop-drone",
      demoUrl: "https://example.com/crop-drone-demo",
    },
    stats: { views: 1240, likes: 342, comments: 18 },
    tags: ["Featured"],
  },
  {
    id: "p2",
    title: "Solar Irrigation System",
    university: "University of Ghana",
    field: "Engineering",
    imageUrl: "https://picsum.photos/seed/p2/600/400",
    problem:
      "Off-grid farms have no affordable way to power irrigation pumps without diesel generators.",
    solution:
      "A solar-powered pump controller with soil-moisture sensing that schedules irrigation automatically.",
    techStack: ["C++", "Arduino", "React Native"],
    team: [{ id: "t3", name: "Ama K." }],
    documents: [{ id: "d3", label: "Technical Documentation.pdf", kind: "pdf", sizeLabel: "1.8 MB" }],
    links: { githubUrl: "https://github.com/example/solar-irrigation" },
    stats: { views: 512, likes: 88, comments: 6 },
    tags: [],
  },
  {
    id: "p3",
    title: "Blockchain Land Registry",
    university: "University of Lagos",
    field: "Tech",
    imageUrl: "https://picsum.photos/seed/p3/600/400",
    problem:
      "Land title disputes are common where paper-based registries can be altered or lost.",
    solution:
      "A blockchain-backed land registry giving each parcel a tamper-evident ownership history.",
    techStack: ["Solidity", "Node.js", "React"],
    team: [{ id: "t4", name: "David M." }],
    documents: [],
    links: { githubUrl: "https://github.com/example/land-registry" },
    stats: { views: 861, likes: 129, comments: 22 },
    tags: ["Blockchain"],
  },
  {
    id: "p4",
    title: "AI Diagnostic Tool for Rural Clinics",
    university: "Amoud University",
    field: "Health",
    imageUrl: "https://picsum.photos/seed/p4/600/400",
    problem:
      "Rural clinics often lack a radiologist on staff to review basic diagnostic imaging quickly.",
    solution:
      "A lightweight on-device model flags likely-abnormal chest X-rays for priority review by the nearest available doctor.",
    techStack: ["PyTorch", "Flutter", "FastAPI"],
    team: [{ id: "t5", name: "Amara O." }],
    documents: [{ id: "d4", label: "Clinical Validation Notes.pdf", kind: "pdf", sizeLabel: "900 KB" }],
    links: {},
    stats: { views: 143, likes: 21, comments: 3 },
    tags: [],
  },
];

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((project) => project.id === id);
}
