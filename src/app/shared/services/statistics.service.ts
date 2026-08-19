import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedData } from '../models/common.model';
import { apiUrl } from '../../core/config/api.config';

export interface PlatformStatistics {
  enrolledCourses: number;
  totalLectureTime: number;
  totalVideoWatches: number;
  completedLessons: number;
  totalQuizOpens: number;
  totalQuizCompletions: number;
}

export interface CourseStatistics {
  videosWatched: number;
  totalVideos: number;
  videosPercentage: number;
  testsCompleted: number;
  totalTests: number;
  testsPercentage: number;
  highestScore: number;
  maxScore: number;
  scorePercentage: number;
}

export interface WatchingDetail {
  id: number;
  courseId: number;
  lessonId: number;
  videoTitle: string;
  courseName: string;
  watchTimeSeconds: number;
  lastPositionSeconds: number;
  completed: boolean;
  watchDate: string;
}

export interface TeacherCourseAnalytics {
  courseId: number;
  title: string;
  studentsCount: number;
  lessonsCount: number;
  activeStudents: number;
  totalWatchTimeSeconds: number;
  completedLessons: number;
  averageProgressPercentage: number;
  forumTopics: number;
  pendingReports: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly API_URL = apiUrl('statistics');

  constructor(private http: HttpClient) {}

  // Get platform statistics
  getPlatformStatistics(): Observable<ApiResponse<PlatformStatistics>> {
    return this.http.get<ApiResponse<PlatformStatistics>>(`${this.API_URL}/platform`);
  }

  // Get course statistics
  getCourseStatistics(): Observable<ApiResponse<CourseStatistics>> {
    return this.http.get<ApiResponse<CourseStatistics>>(`${this.API_URL}/courses`);
  }

  // Get watching details
  getWatchingDetails(page = 1, pageSize = 20): Observable<ApiResponse<PaginatedData<WatchingDetail>>> {
    return this.http.get<ApiResponse<PaginatedData<WatchingDetail>>>(`${this.API_URL}/watching-details`, {
      params: { page, pageSize }
    });
  }

  getTeacherCourses(): Observable<ApiResponse<TeacherCourseAnalytics[]>> {
    return this.http.get<ApiResponse<TeacherCourseAnalytics[]>>(`${this.API_URL}/teacher/courses`);
  }

  // Get subscription details
  getSubscriptions(params?: any): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/subscriptions`, {
      params
    });
  }
}