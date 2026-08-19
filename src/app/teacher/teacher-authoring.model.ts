export type CourseStatus = 'draft' | 'published';
export type ContentType = 'video' | 'homework' | 'test';

export interface TeacherContent {
  id: number;
  sessionId: number;
  title: string;
  position: number;
  url?: string;
  provider?: string;
  maxGrade?: number;
  dateOfDelivery?: string;
  instructions?: string | null;
  questions?: Array<{
    id?: number;
    prompt: string;
    points: number;
    options: Array<{ id?: number; text: string; isCorrect: boolean }>;
  }>;
}

export interface TeacherSession {
  id: number;
  courseId: number;
  title: string;
  description: string;
  position: number;
  videos: TeacherContent[];
  homeworks: TeacherContent[];
  tests: TeacherContent[];
}

export interface TeacherCourse {
  id: number;
  title: string;
  description: string;
  studyYear: string;
  status: CourseStatus;
  publishedAt: string | null;
  lessonsCount: number;
  studentsCount: number;
  price: number;
  currency: string;
  sessions?: TeacherSession[];
}

export interface RosterStudent {
  id: number;
  fullName: string;
  email: string;
  studyYear: string;
}
