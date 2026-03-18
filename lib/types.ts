/** Matches Prisma User model (camelCase fields, snake_case DB columns via @map) */
export interface DbUser {
  id: number;
  clerkId: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

/** Matches Prisma Application model */
export interface Application {
  id: number;
  name: string;
  slug: string;
  introduction: string | null;
  heroImage: string | null;
  status: string;
  createdAt: Date;
}

/** Matches Prisma Documentation model */
export interface Documentation {
  id: number;
  applicationId: number;
  title: string;
  slug: string;
  parentId: number | null;
  content: string | null;
  sortOrder: number;
  createdAt: Date;
}

/** Matches Prisma ContactSubmission model */
export interface ContactSubmission {
  id: number;
  name: string;
  email: string | null;
  subject: string;
  message: string;
  ipAddress: string | null;
  roleType: string;
  isRead: boolean;
  createdAt: Date;
}

/** Documentation tree node with nested children for sidebar navigation */
export interface DocTreeNode extends Documentation {
  children: DocTreeNode[];
}
