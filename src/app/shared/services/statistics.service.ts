import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common.model';

export interface PlatformStatistics {
  totalLectureTime: number;
  totalVideoWatches: number;
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

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly API_URL = '/api/statistics';

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
  getWatchingDetails(params?: any): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/watching-details`, {
      params
    });
  }

  // Get subscription details
  getSubscriptions(params?: any): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/subscriptions`, {
      params
    });
  }
}