export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  studyYear: string;
  gender: string;
  sector: string;
  nationality: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage?: File;
  idImage?: File;
}