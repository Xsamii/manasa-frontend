import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CourseService } from './course.service';
import { apiUrl } from '../../core/config/api.config';

describe('CourseService', () => {
  let service: CourseService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CourseService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses the backend my-courses and curriculum contracts', () => {
    service.getMyCourses().subscribe();
    const myCourses = http.expectOne(apiUrl('courses/my-courses'));
    expect(myCourses.request.method).toBe('GET');
    myCourses.flush({ success: true, data: [] });

    service.getCourseCurriculum(12).subscribe();
    const curriculum = http.expectOne(apiUrl('courses/12/curriculum'));
    expect(curriculum.request.method).toBe('GET');
    curriculum.flush({ success: true, data: [] });
  });

  it('sends resumable lesson progress fields', () => {
    service.updateLessonProgress(12, 5, 90, 42).subscribe();

    const request = http.expectOne(apiUrl('courses/12/lessons/5/progress'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      watchTimeSeconds: 90,
      positionSeconds: 42,
    });
    request.flush({ success: true, data: {} });
  });

  it('uses the authenticated enrollment endpoint', () => {
    service.enrollInCourse(12).subscribe();

    const request = http.expectOne(apiUrl('courses/12/enroll'));
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.has('x-idempotency-key')).toBeTrue();
    request.flush({ success: true, data: { courseId: 12, enrolled: true } });
  });
});
