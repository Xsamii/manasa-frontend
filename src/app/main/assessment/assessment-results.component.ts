import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssessmentResult, AssessmentService, AssessmentType } from '../../shared/services/assessment.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="max-w-5xl mx-auto p-6" dir="rtl">
      <h1 class="text-3xl font-bold">نتائج التقييمات</h1>
      <p class="text-slate-600 mt-2">تظهر الدرجات وملاحظات المعلم بعد نشرها فقط.</p>
      <div class="flex gap-3 mt-5">
        <a routerLink="/assessments/results/center" class="border rounded px-4 py-2">الكل</a>
        <a routerLink="/assessments/results/exams" class="border rounded px-4 py-2">الاختبارات</a>
        <a routerLink="/assessments/results/homework" class="border rounded px-4 py-2">الواجبات</a>
      </div>
      <p *ngIf="loading" class="mt-8">جار تحميل النتائج...</p>
      <p *ngIf="error" class="mt-8 text-red-700">{{ error }}</p>
      <div class="mt-6 grid gap-4">
        <article *ngFor="let result of results" class="bg-white rounded-xl shadow p-5">
          <div class="flex justify-between gap-4">
            <div>
              <span class="text-sm text-orange-700">{{ result.type === 'test' ? 'اختبار' : 'واجب' }}</span>
              <h2 class="text-xl font-bold">{{ result.title }}</h2>
              <p class="text-slate-600">{{ result.courseTitle }}</p>
            </div>
            <div class="text-left">
              <strong *ngIf="result.state === 'released'" class="text-2xl">{{ result.score }} / {{ result.maxGrade }}</strong>
              <span *ngIf="result.state !== 'released'" class="text-slate-500">{{ stateLabel(result.state) }}</span>
            </div>
          </div>
          <p *ngIf="result.state === 'released' && result.feedback" class="mt-4 border-t pt-3">{{ result.feedback }}</p>
        </article>
        <p *ngIf="!loading && !results.length" class="bg-white rounded-xl p-6">لا توجد تسليمات حتى الآن.</p>
      </div>
    </main>
  `,
})
export class AssessmentResultsComponent implements OnInit {
  results: AssessmentResult[] = [];
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private assessments: AssessmentService) {}

  ngOnInit(): void {
    const type = this.route.snapshot.data['type'] as AssessmentType | undefined;
    this.assessments.getResults(type).subscribe({
      next: response => this.results = response.data ?? [],
      error: () => this.error = 'تعذر تحميل النتائج.',
      complete: () => this.loading = false,
    });
  }

  stateLabel(state: string): string {
    return ({ draft: 'مسودة', submitted: 'قيد التصحيح', graded: 'تم التصحيح ولم تُنشر', released: 'منشورة' } as Record<string, string>)[state] ?? state;
  }
}
