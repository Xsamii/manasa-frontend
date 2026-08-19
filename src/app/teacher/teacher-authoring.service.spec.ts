import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TeacherAuthoringService } from './teacher-authoring.service';
import { apiUrl } from '../core/config/api.config';

describe('TeacherAuthoringService', () => {
  let service: TeacherAuthoringService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TeacherAuthoringService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses protected teacher draft and publish contracts', () => {
    service.listCourses().subscribe();
    const list = http.expectOne(apiUrl('courses/teacher/mine'));
    expect(list.request.method).toBe('GET');
    list.flush({ success: true, data: [] });

    service.setPublished(3, true).subscribe();
    const publish = http.expectOne(apiUrl('courses/teacher/3/publish'));
    expect(publish.request.method).toBe('POST');
    publish.flush({ success: true, data: {} });
  });

  it('routes each authored content type to its own resource', () => {
    service.createContent('video', {
      sessionId: 9,
      title: 'Intro',
      url: 'https://example.com/video',
    }).subscribe();
    const request = http.expectOne(apiUrl('videos'));
    expect(request.request.body.sessionId).toBe(9);
    request.flush({ success: true, data: {} });
  });
});
