export interface Course {
  id: number;
  title: string;
  description: string;
  studyYear: string;
  instructor: Instructor | null;
  lessonsCount: number;
  studentsCount: number;
  isEnrolled: boolean;
  progressPercentage?: number;
  resumeLessonId?: number | null;
  curriculumPreview?: LessonPreview[];
  price: number;
  currency: string;
  previewVideo?: {
    id: number;
    title: string;
    provider: string;
    url: string | null;
    previewMaxSeconds: number;
  } | null;
}

export interface Instructor {
  id: number;
  name: string;
  title: string;
}

export interface LessonPreview {
  id: number;
  title: string;
  description: string;
  order: number;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description: string;
  videoUrl: string | null;
  order: number;
  videos: Array<{
    id: number;
    title: string;
    url: string | null;
    provider: string;
    status?: string;
    isPreview?: boolean;
    previewMaxSeconds?: number;
  }>;
  outline?: Array<{ kind: 'lesson' | 'homework_solution' | 'practice'; title: string }>;
  materials?: Array<{
    id: number;
    title: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>;
  resources: Array<{ id: number; type: 'homework' | 'test'; title: string }>;
  completed: boolean;
  watchTimeSeconds: number;
  lastPositionSeconds: number;
}

export interface CourseProgress {
  courseId: number;
  completedLessons: number[];
  lastWatchedLessonId: number | null;
  lastPositionSeconds: number;
  totalWatchTimeSeconds: number;
  progressPercentage: number;
  updatedAt: string | null;
}

export interface LessonProgress {
  courseId: number;
  lessonId: number;
  watchTimeSeconds: number;
  lastPositionSeconds: number;
  completed: boolean;
  completedAt: string | null;
  updatedAt: string;
}

export interface EnrollmentResult {
  courseId: number;
  enrolled: true;
  alreadyEnrolled: boolean;
}