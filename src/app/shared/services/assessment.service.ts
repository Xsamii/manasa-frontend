import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedData } from '../models/common.model';

export interface AssessmentResult {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  status: 'pass' | 'fail' | 'retake';
  date: Date;
  type: 'center' | 'exam' | 'homework';
}

export interface CustomQuizOptions {
  subjects: string[];
  questionCount: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  includeWrongAnswers: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private readonly API_URL = '/api/assessments';

  constructor(private http: HttpClient) {}

  // Get center results
  getCenterResults(params?: any): Observable<ApiResponse<PaginatedData<AssessmentResult>>> {
    return this.http.get<ApiResponse<PaginatedData<AssessmentResult>>>(`${this.API_URL}/center-results`, {
      params
    });
  }

  // Get exam results
  getExamResults(params?: any): Observable<ApiResponse<PaginatedData<AssessmentResult>>> {
    return this.http.get<ApiResponse<PaginatedData<AssessmentResult>>>(`${this.API_URL}/exam-results`, {
      params
    });
  }

  // Get homework results
  getHomeworkResults(params?: any): Observable<ApiResponse<PaginatedData<AssessmentResult>>> {
    return this.http.get<ApiResponse<PaginatedData<AssessmentResult>>>(`${this.API_URL}/homework-results`, {
      params
    });
  }

  // Get wrong questions count by subject
  getWrongQuestionsCount(): Observable<ApiResponse<{ [subject: string]: number }>> {
    return this.http.get<ApiResponse<{ [subject: string]: number }>>(`${this.API_URL}/wrong-questions-count`);
  }

  // Create custom quiz
  createCustomQuiz(options: CustomQuizOptions): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/custom-quiz`, options);
  }

  // Get available subjects for quiz
  getQuizSubjects(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.API_URL}/quiz-subjects`);
  }
}