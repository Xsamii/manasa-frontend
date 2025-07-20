export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: Instructor;
  subject: string;
  thumbnail: string;
  price: number;
  duration: string;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  isSubscribed: boolean;
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  isCompleted: boolean;
  canAccess: boolean;
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  lastWatchedLesson?: string;
  totalWatchTime: number;
  progressPercentage: number;
  updatedAt: Date;
}