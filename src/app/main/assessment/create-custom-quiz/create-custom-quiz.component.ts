import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { AssessmentSummary, AssessmentService } from '../../../shared/services/assessment.service';
import { CourseService } from '../../../shared/services/course.service';

@Component({
  selector: 'app-create-custom-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './create-custom-quiz.component.html',
  styleUrl: './create-custom-quiz.component.scss'
})
export class CreateCustomQuizComponent implements OnInit {
  tests: Array<AssessmentSummary & { courseTitle: string }> = [];
  loading = true;
  error = '';

  constructor(private courses: CourseService, private assessments: AssessmentService) {}

  ngOnInit(): void {
    this.courses.getMyCourses().pipe(
      switchMap(response => {
        const courses = response.data ?? [];
        if (!courses.length) return of([]);
        return forkJoin(courses.map(course => this.assessments.getCourseAssessments(course.id))).pipe(
          switchMap(responses => of(responses.flatMap((response, index) =>
            (response.data?.tests ?? []).map(test => ({ ...test, courseTitle: courses[index].title }))
          )))
        );
      })
    ).subscribe({
      next: tests => this.tests = tests,
      error: () => this.error = 'تعذر تحميل الاختبارات المتاحة.',
      complete: () => this.loading = false,
    });
  }
}
