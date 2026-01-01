export type UserRole = "student" | "teacher" | "staff";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department: string;
  yearOrPosition: string;
  summary: string;
  skills: string[];
  projects: string[];
  publications?: string[];
  image?: string;
  location?: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  footerText: string;
}
