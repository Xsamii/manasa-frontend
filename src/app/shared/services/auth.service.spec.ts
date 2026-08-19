import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from '../models/user.model';
import { apiUrl } from '../../core/config/api.config';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
      ],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('stores the session id and normalized user after login', () => {
    service
      .signIn('student@example.com', 'Password1!', UserRole.STUDENT)
      .subscribe();

    const request = http.expectOne(apiUrl('auth/login'));
    expect(request.request.body.role).toBe(UserRole.STUDENT);
    request.flush({
      success: true,
      data: {
        sessionId: 'session-id',
        expiresAt: '2030-01-01T00:00:00.000Z',
        user: {
          id: 1,
          fullName: 'Student',
          email: 'student@example.com',
          phoneNumber: '123',
          role: UserRole.STUDENT,
        },
      },
      message: 'ok',
      timestamp: new Date().toISOString(),
      path: '/api/auth/login',
    });

    expect(localStorage.getItem('sessionId')).toBe('session-id');
    expect(service.currentUser?.role).toBe(UserRole.STUDENT);
  });

  it('restores and refreshes a stored session', () => {
    localStorage.setItem('sessionId', 'stored-session');
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        id: 2,
        fullName: 'Teacher',
        email: 'teacher@example.com',
        phoneNumber: '456',
        role: UserRole.TEACHER,
      }),
    );

    const restored = new AuthService(
      TestBed.inject(HttpClient),
      TestBed.inject(Router),
    );
    expect(restored.currentUser?.role).toBe(UserRole.TEACHER);
    http.expectOne(apiUrl('auth/session')).flush({
      success: true,
      data: { user: restored.currentUser },
      message: 'ok',
      timestamp: new Date().toISOString(),
      path: '/api/auth/session',
    });
  });
});
