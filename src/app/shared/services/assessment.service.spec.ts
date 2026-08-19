import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AssessmentService } from './assessment.service';

describe('AssessmentService', () => {
  let service: AssessmentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AssessmentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('saves test answers to the protected attempt endpoint', () => {
    service.saveAnswers(7, [{ questionId: 2, selectedOptionId: 4 }]).subscribe();
    const request = http.expectOne(req => req.url.endsWith('/assessments/attempts/7/answers'));
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body.answers[0]).toEqual({ questionId: 2, selectedOptionId: 4 });
    request.flush({ success: true, data: {} });
  });

  it('submits homework with HTTPS attachment metadata', () => {
    service.saveHomework(3, {
      text: 'answer',
      attachmentUrl: 'https://files.example/work.pdf',
      attachmentName: 'work.pdf',
      submit: true,
    }).subscribe();
    const request = http.expectOne(req => req.url.endsWith('/assessments/homeworks/3/submission'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body.submit).toBeTrue();
    request.flush({ success: true, data: {} });
  });

  it('requests only test results for the exam result page', () => {
    service.getResults('test').subscribe();
    const request = http.expectOne(req =>
      req.url.endsWith('/assessments/results') && req.params.get('type') === 'test'
    );
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: [] });
  });

  it('uses teacher-owned grade and release endpoints', () => {
    service.grade('homework', 8, 9, 'Well done').subscribe();
    const grade = http.expectOne(req => req.url.endsWith('/assessments/teacher/homework/8/grade'));
    expect(grade.request.body).toEqual({ score: 9, feedback: 'Well done' });
    grade.flush({ success: true, data: {} });

    service.release('homework', 8).subscribe();
    const release = http.expectOne(req => req.url.endsWith('/assessments/teacher/homework/8/release'));
    expect(release.request.method).toBe('POST');
    release.flush({ success: true, data: {} });
  });
});
