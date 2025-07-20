import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedData } from '../models/common.model';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  subject: string;
  createdAt: Date;
  repliesCount: number;
  lastReply?: Date;
}

export interface ForumReply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private readonly API_URL = '/api/forum';

  constructor(private http: HttpClient) {}

  // Get forum posts
  getPosts(subject?: string, params?: any): Observable<ApiResponse<PaginatedData<ForumPost>>> {
    return this.http.get<ApiResponse<PaginatedData<ForumPost>>>(`${this.API_URL}/posts`, {
      params: { subject, ...params }
    });
  }

  // Get post details with replies
  getPost(postId: string): Observable<ApiResponse<ForumPost & { replies: ForumReply[] }>> {
    return this.http.get<ApiResponse<ForumPost & { replies: ForumReply[] }>>(`${this.API_URL}/posts/${postId}`);
  }

  // Create new post
  createPost(post: Partial<ForumPost>): Observable<ApiResponse<ForumPost>> {
    return this.http.post<ApiResponse<ForumPost>>(`${this.API_URL}/posts`, post);
  }

  // Reply to post
  replyToPost(postId: string, content: string): Observable<ApiResponse<ForumReply>> {
    return this.http.post<ApiResponse<ForumReply>>(`${this.API_URL}/posts/${postId}/replies`, {
      content
    });
  }

  // Get forum subjects
  getSubjects(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.API_URL}/subjects`);
  }
}