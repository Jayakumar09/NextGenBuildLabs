export enum UserRole {
  SUPERADMIN = 'superadmin',
  STAFF = 'staff',
  CLIENT = 'client',
}

export interface UserProfile {
  uid: string;
  email: string | null;
  role: UserRole;
  displayName: string | null;
  clientId?: string;
  active: 'active' | 'suspended' | 'inactive';
  createdAt: number;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  progress: number;
  budget: number;
  deadline: string;
  manager: string; // "NextGen Build Labs"
  updatedAt: number;
  notes?: string;
}

export interface ClientData {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  projectType: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'UNPAID';
  joinDate: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  dueDate: string;
  method?: string;
  plan?: string;
  createdAt: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  source: 'WEB_FORM' | 'WHATSAPP' | 'REFERRAL';
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST' | 'WON';
  message: string;
  createdAt: number;
}

export interface Ticket {
  id: string;
  clientId: string;
  subject: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: number;
}
