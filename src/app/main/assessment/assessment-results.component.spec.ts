import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AssessmentService } from '../../shared/services/assessment.service';
import { AssessmentResultsComponent } from './assessment-results.component';

describe('AssessmentResultsComponent', () => {
  let fixture: ComponentFixture<AssessmentResultsComponent>;

  beforeEach(async () => {
    const assessments = jasmine.createSpyObj<AssessmentService>('AssessmentService', ['getResults']);
    assessments.getResults.and.returnValue(of({
      success: true,
      message: 'ok',
      timestamp: new Date().toISOString(),
      path: '/assessments/results',
      data: [
        {
          type: 'test',
          assessmentId: 1,
          submissionId: 2,
          title: 'Hidden grade',
          courseTitle: 'Math',
          state: 'graded',
          score: null,
          maxGrade: 10,
          feedback: null,
          submittedAt: null,
          releasedAt: null,
        },
        {
          type: 'homework',
          assessmentId: 3,
          submissionId: 4,
          title: 'Released grade',
          courseTitle: 'Math',
          state: 'released',
          score: 9,
          maxGrade: 10,
          feedback: 'Excellent',
          submittedAt: null,
          releasedAt: new Date().toISOString(),
        },
      ],
    }));

    await TestBed.configureTestingModule({
      imports: [AssessmentResultsComponent],
      providers: [
        { provide: AssessmentService, useValue: assessments },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AssessmentResultsComponent);
    fixture.detectChanges();
  });

  it('hides graded scores and displays only released grades', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('تم التصحيح ولم تُنشر');
    expect(text).toContain('9 / 10');
    expect(text).toContain('Excellent');
  });
});
