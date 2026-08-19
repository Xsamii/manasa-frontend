export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
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