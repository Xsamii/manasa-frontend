import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../core/config/api.config';
import { ApiResponse } from '../shared/models/common.model';

export interface CreateTeacherInput {
  fullName: string;
  email: string;
  specialization: string;
  phoneNumber: string;
  password: string;
}

export interface CreateStudentInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  studyYear: string;
  gender: string;
  schoolName?: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private readonly http: HttpClient) {}

  createTeacher(input: CreateTeacherInput): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(apiUrl('admin/teachers'), input);
  }

  createStudent(input: CreateStudentInput): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(apiUrl('admin/students'), input);
  }
}
