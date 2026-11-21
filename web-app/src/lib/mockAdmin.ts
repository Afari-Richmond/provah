export type PendingProfessional = {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  appliedAt: string;
};

export const pendingProfessionals: PendingProfessional[] = [
  {
    id: "pp1",
    name: "Grace Appiah",
    title: "Engineering Manager",
    company: "Flutterwave",
    email: "grace.appiah@flutterwave.com",
    appliedAt: "2025-11-18",
  },
  {
    id: "pp2",
    name: "Samuel Boateng",
    title: "Investor",
    company: "Golden Palm Ventures",
    email: "samuel@goldenpalm.vc",
    appliedAt: "2025-11-17",
  },
];

export type AccountStatus = "active" | "suspended";

export type AdminUser = {
  id: string;
  name: string;
  role: "student" | "professional";
  email: string;
  detail: string; // university or company
  status: AccountStatus;
  joinedAt: string;
};

export const mockUsers: AdminUser[] = [
  {
    id: "u1",
    name: "Ama Owusu",
    role: "student",
    email: "ama.owusu@university.edu",
    detail: "University of Ghana",
    status: "active",
    joinedAt: "2025-09-02",
  },
  {
    id: "u2",
    name: "Kwame Asante",
    role: "student",
    email: "kwame.asante@knust.edu.gh",
    detail: "KNUST",
    status: "active",
    joinedAt: "2025-08-14",
  },
  {
    id: "u3",
    name: "Tunde Okafor",
    role: "student",
    email: "tunde.okafor@unilag.edu.ng",
    detail: "University of Lagos",
    status: "active",
    joinedAt: "2025-09-20",
  },
  {
    id: "u4",
    name: "Zainab Mohammed",
    role: "student",
    email: "zainab.m@ashesi.edu.gh",
    detail: "Ashesi University",
    status: "suspended",
    joinedAt: "2025-07-30",
  },
  {
    id: "u5",
    name: "David Mensah",
    role: "professional",
    email: "david.mensah@mtn.com",
    detail: "MTN Group",
    status: "active",
    joinedAt: "2025-10-05",
  },
  {
    id: "u6",
    name: "Grace Appiah",
    role: "professional",
    email: "grace.appiah@flutterwave.com",
    detail: "Flutterwave",
    status: "active",
    joinedAt: "2025-11-18",
  },
];

export const signupsByWeek = [
  { label: "Oct 20", students: 4, professionals: 1 },
  { label: "Oct 27", students: 6, professionals: 2 },
  { label: "Nov 3", students: 5, professionals: 1 },
  { label: "Nov 10", students: 9, professionals: 3 },
  { label: "Nov 17", students: 7, professionals: 2 },
];
