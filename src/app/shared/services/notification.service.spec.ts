import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NotificationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses the recipient-scoped mark-read endpoint', () => {
    service.markRead(8).subscribe();
    const request = http.expectOne(req =>
      req.url.endsWith('/notifications/8/read'),
    );
    expect(request.request.method).toBe('PATCH');
    request.flush({ success: true, data: {}, message: 'ok' });
  });
});
