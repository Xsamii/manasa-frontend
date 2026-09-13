export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  schoolName?: string | null;
  studyYear?: string | null;
  governorate?: string | null;
  address?: string | null;
  specialization?: string | null;
  gender?: string | null;
  jobTitle?: string | null;
  fatherPhoneNumber?: string | null;
  fatherCountryCode?: string | null;
  motherPhoneNumber?: string | null;
  motherCountryCode?: string | null;
  parentUnavailable?: 'none' | 'father' | 'mother';
  accountStatus?: 'pending' | 'approved' | 'rejected';
  profileAccessEnabled?: boolean;
  centerId?: number | null;
  centerName?: string | null;
}

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

export interface UserRegistration {
  fullName: string;
  countryCode: string;
  phoneNumber: string;
  fatherCountryCode: string;
  fatherPhoneNumber: string;
  motherCountryCode: string;
  motherPhoneNumber: string;
  parentUnavailable: 'none' | 'father' | 'mother';
  schoolName: string;
  jobTitle: string;
  governorate: string;
  dateOfBirth: string;
  address: string;
  studyYear: string;
  gender: string;
  sector: string;
  nationality: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthSession {
  sessionId: string;
  expiresAt: string;
  user: User;
}
