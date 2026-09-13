import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../core/config/api.config';
import { ApiResponse } from '../shared/models/common.model';
import {
  ContentType,
  RosterStudent,
  TeacherContent,
  TeacherCourse,
  TeacherSession,
} from './teacher-authoring.model';

@Injectable({ providedIn: 'root' })
export class TeacherAuthoringService {
  private readonly coursesUrl = apiUrl('courses');

  constructor(private readonly http: HttpClient) {}

  listCourses(): Observable<ApiResponse<TeacherCourse[]>> {
    return this.http.get<ApiResponse<TeacherCourse[]>>(`${this.coursesUrl}/teacher/mine`);
  }

  getCourse(id: number): Observable<ApiResponse<TeacherCourse>> {
    return this.http.get<ApiResponse<TeacherCourse>>(`${this.coursesUrl}/teacher/${id}`);
  }

  createCourse(input: Partial<TeacherCourse>): Observable<ApiResponse<TeacherCourse>> {
    return this.http.post<ApiResponse<TeacherCourse>>(this.coursesUrl, input);
  }

  updateCourse(id: number, input: Partial<TeacherCourse>): Observable<ApiResponse<TeacherCourse>> {
    return this.http.put<ApiResponse<TeacherCourse>>(`${this.coursesUrl}/${id}`, input);
  }

  deleteCourse(id: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.coursesUrl}/${id}`);
  }

  setPublished(id: number, publish: boolean): Observable<ApiResponse<TeacherCourse>> {
    const action = publish ? 'publish' : 'unpublish';
    return this.http.post<ApiResponse<TeacherCourse>>(
      `${this.coursesUrl}/teacher/${id}/${action}`,
      {},
    );
  }

  getRoster(id: number): Observable<ApiResponse<RosterStudent[]>> {
    return this.http.get<ApiResponse<RosterStudent[]>>(
      `${this.coursesUrl}/teacher/${id}/roster`,
    );
  }

  createSession(courseId: number, input: Partial<TeacherSession>): Observable<ApiResponse<TeacherSession>> {
    return this.http.post<ApiResponse<TeacherSession>>(
      `${this.coursesUrl}/${courseId}/sessions`,
      { ...input, courseId },
    );
  }

  updateSession(id: number, input: Partial<TeacherSession>): Observable<ApiResponse<TeacherSession>> {
    return this.http.patch<ApiResponse<TeacherSession>>(apiUrl(`session/${id}`), input);
  }

  deleteSession(id: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(apiUrl(`session/${id}`));
  }

  createContent(type: ContentType, input: Partial<TeacherContent>): Observable<ApiResponse<TeacherContent>> {
    return this.http.post<ApiResponse<TeacherContent>>(apiUrl(this.resource(type)), input);
  }

  updateContent(type: ContentType, id: number, input: Partial<TeacherContent>): Observable<ApiResponse<TeacherContent>> {
    return this.http.patch<ApiResponse<TeacherContent>>(
      apiUrl(`${this.resource(type)}/${id}`),
      input,
    );
  }

  deleteContent(type: ContentType, id: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(
      apiUrl(`${this.resource(type)}/${id}`),
    );
  }

  createVideoUpload(input: {
    sessionId: number;
    title: string;
    position?: number;
    isPreview?: boolean;
    previewMaxSeconds?: number;
  }): Observable<ApiResponse<{
    video: TeacherContent;
    upload: {
      endpoint: string;
      libraryId: string;
      videoId: string;
      expire: number;
      signature: string;
    };
  }>> {
    return this.http.post<ApiResponse<{
      video: TeacherContent;
      upload: {
        endpoint: string;
        libraryId: string;
        videoId: string;
        expire: number;
        signature: string;
      };
    }>>(apiUrl('videos/uploads'), input);
  }

  getVideoStatus(id: number): Observable<ApiResponse<TeacherContent>> {
    return this.http.get<ApiResponse<TeacherContent>>(apiUrl(`videos/${id}/status`));
  }

  addMaterial(sessionId: number, file: File, title: string) {
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    return this.http.post<ApiResponse<unknown>>(apiUrl(`session/${sessionId}/materials`), form);
  }

  deleteMaterial(id: number) {
    return this.http.delete<ApiResponse<unknown>>(apiUrl(`session/materials/${id}`));
  }

  private resource(type: ContentType): string {
    return type === 'video' ? 'videos' : type === 'homework' ? 'homeworks' : 'tests';
  }
}
