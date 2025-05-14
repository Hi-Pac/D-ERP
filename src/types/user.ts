import { Timestamp, DocumentData } from 'firebase/firestore';

export interface User extends DocumentData {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  lastLoginAt: Timestamp | Date | null;
  photoURL?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  department?: string;
  position?: string;
  hireDate?: Date | null;
  birthDate?: Date | null;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  permissions?: string[];
  settings?: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}



export interface UserFormData extends Omit<User, 'uid' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'emailVerified'> {
  password?: string;
  confirmPassword?: string;
  role: string;
  isActive: boolean;
}

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  department?: string;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
}

export const defaultUser: Partial<User> = {
  role: 'viewer',
  isActive: true,
  emailVerified: false,
  settings: {
    theme: 'light',
    language: 'ar',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  },
};
