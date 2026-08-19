import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  AuthSession,
  User,
  UserRegistration,
  UserRole,
} from '../models/user.model';
import { ApiResponse } from '../models/common.model';
import { apiUrl } from '../../core/config/api.config';
import { SESSION_ID_STORAGE_KEY } from '../../core/interceptors/session.interceptor';

const USER_STORAGE_KEY = 'currentUser';

export interface DeviceSession {
  id: string;
  device: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
  current: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = apiUrl('auth');
  private readonly STUDENTS_URL = apiUrl('students');
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private sessionReadySubject = new BehaviorSubject(false);
  public currentUser$ = this.currentUserSubject.asObservable();
  public sessionReady$ = this.sessionReadySubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.restoreSession();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  register(userData: UserRegistration): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.STUDENTS_URL, userData);
  }

  signIn(
    email: string,
    password: string,
    role: UserRole,
  ): Observable<ApiResponse<AuthSession>> {
    return this.http.post<ApiResponse<AuthSession>>(`${this.API_URL}/login`, {
      email,
      password,
      role,
    }).pipe(
      tap(response => {
        if (response.success) {
          this.storeSession(response.data.sessionId, response.data.user);
        }
      })
    );
  }

  logout(): Observable<ApiResponse<{ loggedOut: boolean }>> {
    return this.http
      .post<ApiResponse<{ loggedOut: boolean }>>(`${this.API_URL}/logout`, {})
      .pipe(
        catchError(error => {
          this.clearSession();
          throw error;
        }),
        finalize(() => {
          this.clearSession();
          void this.router.navigate(['/auth/sign-in']);
        }),
      );
  }

  expireSession(): void {
    this.clearSession();
  }

  getActiveSessions(): Observable<ApiResponse<DeviceSession[]>> {
    return this.http.get<ApiResponse<DeviceSession[]>>(apiUrl('user-session/active'));
  }

  revokeSession(sessionId: string): Observable<ApiResponse<{ revoked: boolean; current: boolean }>> {
    return this.http.delete<ApiResponse<{ revoked: boolean; current: boolean }>>(
      apiUrl(`user-session/${sessionId}`),
    ).pipe(
      tap(response => {
        if (response.success && response.data.current) {
          this.clearSession();
          void this.router.navigate(['/auth/sign-in']);
        }
      }),
    );
  }

  isRoleAllowed(roles: UserRole[]): boolean {
    return !!this.currentUser && roles.includes(this.currentUser.role);
  }

  private restoreSession(): void {
    const sessionId = localStorage.getItem(SESSION_ID_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!sessionId || !storedUser) {
      this.clearSession();
      this.sessionReadySubject.next(true);
      return;
    }

    try {
      this.currentUserSubject.next(JSON.parse(storedUser) as User);
    } catch {
      this.clearSession();
      this.sessionReadySubject.next(true);
      return;
    }

    this.http
      .get<ApiResponse<{ user: User }>>(`${this.API_URL}/session`)
      .subscribe({
        next: response => {
          if (response.success) {
            this.storeSession(sessionId, response.data.user);
          } else {
            this.clearSession();
          }
          this.sessionReadySubject.next(true);
        },
        error: () => {
          this.clearSession();
          this.sessionReadySubject.next(true);
        },
      });
  }

  private storeSession(sessionId: string, user: User): void {
    localStorage.setItem(SESSION_ID_STORAGE_KEY, sessionId);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private clearSession(): void {
    localStorage.removeItem(SESSION_ID_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }
}