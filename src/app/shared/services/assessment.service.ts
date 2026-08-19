import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common.model';
import { apiUrl } from '../../core/config/api.config';

export type AssessmentState = 'draft' | 'submitted' | 'graded' | 'released';
export type AssessmentType = 'test' | 'homework';

export interface AssessmentSummary {
  id: number;
  title: string;
  lessonTitle: string;
  instructions: string | null;
  maxGrade: number;
  dueAt: string;
  state: AssessmentState | null;
  submissionId: number | null;
  score: number | null;
  feedback: string | null;
}

export interface CourseAssessments {
  tests: AssessmentSummary[];
  homeworks: AssessmentSummary[];
}

export interface TestQuestion {
  id: number;
  prompt: string;
  points: number;
  options: Array<{ id: number; text: string }>;
}

export interface StudentTest {
  id: number;
  courseId: number;
  title: string;
  instructions: string | null;
  maxGrade: number;
  dueAt: string;
  questions: TestQuestion[];
  attempt: TestAttempt | null;
}

export interface TestAttempt {
  id: number;
  testId: number;
  state: AssessmentState;
  answers: Array<{ questionId: number; selectedOptionId: number | null }>;
  score: number | null;
  feedback: string | null;
}

export interface HomeworkDetail {
  id: number;
  courseId: number;
  title: string;
  instructions: string | null;
  maxGrade: number;
  dueAt: string;
  submission: HomeworkSubmission | null;
}

export interface HomeworkSubmission {
  id: number;
  homeworkId: number;
  state: AssessmentState;
  text: string | null;
  attachment: { url: string; name: string | null; mimeType: string | null; size: number | null } | null;
  score: number | null;
  feedback: string | null;
}

export interface AssessmentResult {
  type: AssessmentType;
  assessmentId: number;
  submissionId: number;
  title: string;
  courseTitle: string;
  state: AssessmentState;
  score: number | null;
  maxGrade: number;
  feedback: string | null;
  submittedAt: string | null;
  releasedAt: string | null;
}

export interface GradingItem extends AssessmentResult {
  id: number;
  student: { id: number; fullName: string; email: string };
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private readonly API_URL = apiUrl('assessments');

  constructor(private http: HttpClient) {}

  getCourseAssessments(courseId: number): Observable<ApiResponse<CourseAssessments>> {
    return this.http.get<ApiResponse<CourseAssessments>>(`${this.API_URL}/course/${courseId}`);
  }

  getTest(id: number): Observable<ApiResponse<StudentTest>> {
    return this.http.get<ApiResponse<StudentTest>>(`${this.API_URL}/tests/${id}`);
  }

  startTest(id: number): Observable<ApiResponse<TestAttempt>> {
    return this.http.post<ApiResponse<TestAttempt>>(`${this.API_URL}/tests/${id}/attempts`, {});
  }

  saveAnswers(attemptId: number, answers: Array<{ questionId: number; selectedOptionId: number | null }>): Observable<ApiResponse<TestAttempt>> {
    return this.http.patch<ApiResponse<TestAttempt>>(`${this.API_URL}/attempts/${attemptId}/answers`, { answers });
  }

  submitTest(attemptId: number): Observable<ApiResponse<TestAttempt>> {
    return this.http.post<ApiResponse<TestAttempt>>(`${this.API_URL}/attempts/${attemptId}/submit`, {});
  }

  getHomework(id: number): Observable<ApiResponse<HomeworkDetail>> {
    return this.http.get<ApiResponse<HomeworkDetail>>(`${this.API_URL}/homeworks/${id}`);
  }

  saveHomework(id: number, input: {
    text?: string;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentMimeType?: string;
    attachmentSize?: number;
    submit?: boolean;
  }): Observable<ApiResponse<HomeworkSubmission>> {
    return this.http.post<ApiResponse<HomeworkSubmission>>(`${this.API_URL}/homeworks/${id}/submission`, input);
  }

  getResults(type?: AssessmentType): Observable<ApiResponse<AssessmentResult[]>> {
    return this.http.get<ApiResponse<AssessmentResult[]>>(`${this.API_URL}/results`, {
      params: type ? { type } : {}
    });
  }

  getGradingQueue(): Observable<ApiResponse<GradingItem[]>> {
    return this.http.get<ApiResponse<GradingItem[]>>(`${this.API_URL}/teacher/queue`);
  }

  getGradingDetail(type: AssessmentType, id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/teacher/${type}/${id}`);
  }

  grade(type: AssessmentType, id: number, score: number, feedback: string): Observable<ApiResponse<GradingItem>> {
    return this.http.patch<ApiResponse<GradingItem>>(`${this.API_URL}/teacher/${type}/${id}/grade`, { score, feedback });
  }

  release(type: AssessmentType, id: number): Observable<ApiResponse<GradingItem>> {
    return this.http.post<ApiResponse<GradingItem>>(`${this.API_URL}/teacher/${type}/${id}/release`, {});
  }
}