import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, Lesson, CourseProgress } from '../models/course.model';
import { ApiResponse, PaginatedData, LazyLoadEvent } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly API_URL = '/api/courses';

  constructor(private http: HttpClient) {}

  // Get user's enrolled courses
  getMyCourses(filters?: any): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(`${this.API_URL}/my-courses`, {
      params: filters
    });
  }

  // Get course details
  getCourse(courseId: string): Observable<ApiResponse<Course>> {
    return this.http.get<ApiResponse<Course>>(`${this.API_URL}/${courseId}`);
  }

  // Get course lessons
  getCourseLessons(courseId: string): Observable<ApiResponse<Lesson[]>> {
    return this.http.get<ApiResponse<Lesson[]>>(`${this.API_URL}/${courseId}/lessons`);
  }

  // Get course progress
  getCourseProgress(courseId: string): Observable<ApiResponse<CourseProgress>> {
    return this.http.get<ApiResponse<CourseProgress>>(`${this.API_URL}/${courseId}/progress`);
  }

  // Update lesson progress
  updateLessonProgress(courseId: string, lessonId: string, watchTime: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/${courseId}/lessons/${lessonId}/progress`, {
      watchTime
    });
  }

  // Mark lesson as completed
  markLessonCompleted(courseId: string, lessonId: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/${courseId}/lessons/${lessonId}/complete`, {});
  }

  // Get available courses for enrollment
  getAvailableCourses(filters?: any): Observable<ApiResponse<PaginatedData<Course>>> {
    return this.http.get<ApiResponse<PaginatedData<Course>>>(`${this.API_URL}/available`, {
      params: filters
    });
  }

  // Enroll in a course
  enrollInCourse(courseId: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/${courseId}/enroll`, {});
  }
}