export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
  CLIENT_USER = 'CLIENT_USER',
}

export interface UserProfile {
  uid: string;
  email: string | null;
  role: UserRole;
  displayName: string | null;
  clientId?: string;
  suspended: boolean;
  createdAt: number;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  progress: number;
  manager: string; // "NextGen Build Labs"
  updatedAt: number;
}

export interface ClientData {
  id: string;
  name: string;
  tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'UNPAID';
}
