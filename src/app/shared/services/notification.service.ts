import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../core/config/api.config';
import { ApiResponse, PaginatedData } from '../models/common.model';

export interface AppNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  metadata: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly url = apiUrl('notifications');

  constructor(private readonly http: HttpClient) {}

  list(page = 1, pageSize = 10): Observable<ApiResponse<PaginatedData<AppNotification>>> {
    return this.http.get<ApiResponse<PaginatedData<AppNotification>>>(this.url, {
      params: { page, pageSize },
    });
  }

  unreadCount(): Observable<ApiResponse<{ count: number }>> {
    return this.http.get<ApiResponse<{ count: number }>>(`${this.url}/unread-count`);
  }

  markRead(id: number): Observable<ApiResponse<AppNotification>> {
    return this.http.patch<ApiResponse<AppNotification>>(`${this.url}/${id}/read`, {});
  }

  markAllRead(): Observable<ApiResponse<{ updated: number }>> {
    return this.http.patch<ApiResponse<{ updated: number }>>(`${this.url}/read-all`, {});
  }
}
