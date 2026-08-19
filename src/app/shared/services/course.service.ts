import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Course,
  CourseProgress,
  EnrollmentResult,
  Lesson,
  LessonProgress,
} from '../models/course.model';
import { ApiResponse, PaginatedData } from '../models/common.model';
import { apiUrl } from '../../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly API_URL = apiUrl('courses');

  constructor(private http: HttpClient) {}

  getMyCourses(): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(`${this.API_URL}/my-courses`);
  }

  getCourse(courseId: number): Observable<ApiResponse<Course>> {
    return this.http.get<ApiResponse<Course>>(`${this.API_URL}/${courseId}`);
  }

  getCourseCurriculum(courseId: number): Observable<ApiResponse<Lesson[]>> {
    return this.http.get<ApiResponse<Lesson[]>>(`${this.API_URL}/${courseId}/curriculum`);
  }

  getCourseProgress(courseId: number): Observable<ApiResponse<CourseProgress>> {
    return this.http.get<ApiResponse<CourseProgress>>(`${this.API_URL}/${courseId}/progress`);
  }

  updateLessonProgress(
    courseId: number,
    lessonId: number,
    watchTimeSeconds: number,
    positionSeconds: number,
  ): Observable<ApiResponse<LessonProgress>> {
    return this.http.post<ApiResponse<LessonProgress>>(`${this.API_URL}/${courseId}/lessons/${lessonId}/progress`, {
      watchTimeSeconds,
      positionSeconds,
    });
  }

  markLessonCompleted(courseId: number, lessonId: number): Observable<ApiResponse<LessonProgress>> {
    return this.http.post<ApiResponse<LessonProgress>>(`${this.API_URL}/${courseId}/lessons/${lessonId}/complete`, {});
  }

  getAvailableCourses(page = 1, pageSize = 12): Observable<ApiResponse<PaginatedData<Course>>> {
    return this.http.get<ApiResponse<PaginatedData<Course>>>(`${this.API_URL}/available`, {
      params: { page, pageSize }
    });
  }

  enrollInCourse(courseId: number): Observable<ApiResponse<EnrollmentResult>> {
    const idempotencyKey = globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return this.http.post<ApiResponse<EnrollmentResult>>(
      `${this.API_URL}/${courseId}/enroll`,
      {},
      { headers: { 'x-idempotency-key': idempotencyKey } },
    );
  }
}