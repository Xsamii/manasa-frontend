import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ForumService } from './student-forum.service';

describe('ForumService', () => {
  let service: ForumService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ForumService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('scopes topic listing to a course with pagination', () => {
    service.getPosts(4, 2, 10).subscribe();
    const request = http.expectOne(req =>
      req.url.endsWith('/forum/courses/4/topics'),
    );
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('pageSize')).toBe('10');
    request.flush({ success: true, data: { items: [], totalRecords: 0 } });
  });

  it('calls the teacher moderation endpoint', () => {
    service.moderate(3, 'hide', 'spam').subscribe();
    const request = http.expectOne(req =>
      req.url.endsWith('/forum/teacher/reports/3/moderate'),
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ action: 'hide', reason: 'spam' });
    request.flush({ success: true, data: {} });
  });
});
