import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../core/config/api.config';
import { ApiResponse } from '../shared/models/common.model';

export interface Center {
  id: number;
  name: string;
  teacherId: number;
}

export interface ReviewStudent {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  fatherPhoneNumber?: string | null;
  motherPhoneNumber?: string | null;
  parentUnavailable?: string;
  schoolName: string;
  jobTitle?: string;
  studyYear: string;
  accountStatus: 'pending' | 'approved' | 'rejected';
  profileAccessEnabled: boolean;
  identityDocumentName?: string | null;
  centerId?: number | null;
  center?: { id: number; name: string } | null;
}

export interface CombinedRow {
  studentId: number;
  studentName: string;
  centerId: number | null;
  centerName: string;
  studyYear: string;
  examScore: number | null;
  homeworkScore: number | null;
  lectureWatchSeconds: number;
  lecturesCompleted: number;
}

@Injectable({ providedIn: 'root' })
export class TeacherOpsService {
  constructor(private readonly http: HttpClient) {}

  pendingStudents(): Observable<ApiResponse<ReviewStudent[]>> {
    return this.http.get<ApiResponse<ReviewStudent[]>>(apiUrl('students/pending'));
  }

  allStudents(): Observable<ApiResponse<ReviewStudent[]>> {
    return this.http.get<ApiResponse<ReviewStudent[]>>(apiUrl('students'));
  }

  approve(id: number, input: { centerId?: number; profileAccessEnabled?: boolean }) {
    return this.http.post<ApiResponse<ReviewStudent>>(apiUrl(`students/${id}/approve`), input);
  }

  reject(id: number, reason?: string) {
    return this.http.post<ApiResponse<ReviewStudent>>(apiUrl(`students/${id}/reject`), { reason });
  }

  setAccess(id: number, profileAccessEnabled: boolean) {
    return this.http.patch<ApiResponse<ReviewStudent>>(apiUrl(`students/${id}/access`), {
      profileAccessEnabled,
    });
  }

  identityUrl(id: number) {
    return apiUrl(`students/${id}/identity-document`);
  }

  downloadIdentity(id: number) {
    return this.http.get(this.identityUrl(id), { responseType: 'blob' });
  }

  listCenters(): Observable<ApiResponse<Center[]>> {
    return this.http.get<ApiResponse<Center[]>>(apiUrl('centers'));
  }

  createCenter(name: string) {
    return this.http.post<ApiResponse<Center>>(apiUrl('centers'), { name });
  }

  combined(params: { centerId?: number; studentId?: number; studyYear?: string }) {
    let httpParams = new HttpParams();
    if (params.centerId) httpParams = httpParams.set('centerId', String(params.centerId));
    if (params.studentId) httpParams = httpParams.set('studentId', String(params.studentId));
    if (params.studyYear) httpParams = httpParams.set('studyYear', params.studyYear);
    return this.http.get<ApiResponse<{ rows: CombinedRow[]; totalRecords: number }>>(
      apiUrl('statistics/teacher/combined'),
      { params: httpParams },
    );
  }

  exportCombined(params: { centerId?: number; studentId?: number; studyYear?: string }) {
    let httpParams = new HttpParams();
    if (params.centerId) httpParams = httpParams.set('centerId', String(params.centerId));
    if (params.studentId) httpParams = httpParams.set('studentId', String(params.studentId));
    if (params.studyYear) httpParams = httpParams.set('studyYear', params.studyYear);
    return this.http.get(apiUrl('statistics/teacher/combined.xls'), {
      params: httpParams,
      responseType: 'blob',
    });
  }
}
