import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedData } from '../models/common.model';
import { apiUrl } from '../../core/config/api.config';

export interface ForumPost {
  id: number;
  courseId: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    type: 'student' | 'teacher';
  };
  state: 'active' | 'hidden' | 'locked';
  createdAt: string;
  updatedAt: string;
  repliesCount: number;
  canEdit: boolean;
  canModerate: boolean;
}

export interface ForumReply {
  id: number;
  topicId: number;
  content: string;
  author: {
    id: number;
    name: string;
    type: 'student' | 'teacher';
  };
  state: 'active' | 'hidden' | 'locked';
  createdAt: string;
  updatedAt: string;
  canEdit: boolean;
  canModerate: boolean;
}

export interface ForumReport {
  id: number;
  courseId: number;
  targetType: 'topic' | 'reply';
  targetId: number;
  reason: string;
  state: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private readonly API_URL = apiUrl('forum');

  constructor(private http: HttpClient) {}

  getPosts(courseId: number, page = 1, pageSize = 10): Observable<ApiResponse<PaginatedData<ForumPost>>> {
    return this.http.get<ApiResponse<PaginatedData<ForumPost>>>(`${this.API_URL}/courses/${courseId}/topics`, {
      params: { page, pageSize }
    });
  }

  getPost(postId: number, page = 1): Observable<ApiResponse<ForumPost & { replies: ForumReply[] }>> {
    return this.http.get<ApiResponse<ForumPost & { replies: ForumReply[] }>>(`${this.API_URL}/topics/${postId}`, {
      params: { page }
    });
  }

  createPost(courseId: number, post: Pick<ForumPost, 'title' | 'content'>): Observable<ApiResponse<ForumPost>> {
    return this.http.post<ApiResponse<ForumPost>>(`${this.API_URL}/courses/${courseId}/topics`, post);
  }

  updatePost(postId: number, post: Partial<ForumPost>): Observable<ApiResponse<ForumPost>> {
    return this.http.patch<ApiResponse<ForumPost>>(`${this.API_URL}/topics/${postId}`, post);
  }

  deletePost(postId: number): Observable<ApiResponse<{ deleted: true }>> {
    return this.http.delete<ApiResponse<{ deleted: true }>>(`${this.API_URL}/topics/${postId}`);
  }

  replyToPost(postId: number, content: string): Observable<ApiResponse<ForumReply>> {
    return this.http.post<ApiResponse<ForumReply>>(`${this.API_URL}/topics/${postId}/replies`, {
      content
    });
  }

  updateReply(replyId: number, content: string): Observable<ApiResponse<ForumReply>> {
    return this.http.patch<ApiResponse<ForumReply>>(`${this.API_URL}/replies/${replyId}`, { content });
  }

  deleteReply(replyId: number): Observable<ApiResponse<{ deleted: true }>> {
    return this.http.delete<ApiResponse<{ deleted: true }>>(`${this.API_URL}/replies/${replyId}`);
  }

  report(target: 'topic' | 'reply', id: number, reason: string): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.API_URL}/${target}/${id}/report`, { reason });
  }

  moderationQueue(courseId: number): Observable<ApiResponse<PaginatedData<ForumReport>>> {
    return this.http.get<ApiResponse<PaginatedData<ForumReport>>>(
      `${this.API_URL}/teacher/courses/${courseId}/moderation`,
    );
  }

  moderate(
    reportId: number,
    action: 'hide' | 'lock' | 'restore' | 'dismiss',
    reason?: string,
  ): Observable<ApiResponse<ForumReport>> {
    return this.http.post<ApiResponse<ForumReport>>(
      `${this.API_URL}/teacher/reports/${reportId}/moderate`,
      { action, reason },
    );
  }
}