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
