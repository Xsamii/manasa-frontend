import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssessmentService, StudentTest, TestAttempt } from '../../shared/services/assessment.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="max-w-4xl mx-auto p-6" dir="rtl">
      <a [routerLink]="['/courses', test?.courseId]" class="text-orange-600">العودة إلى الكورس</a>
      <p *ngIf="loading" class="mt-8">جار تحميل الاختبار...</p>
      <p *ngIf="error" class="mt-8 text-red-700">{{ error }}</p>
      <section *ngIf="test" class="mt-6 bg-white rounded-xl shadow p-6">
        <h1 class="text-2xl font-bold">{{ test.title }}</h1>
        <p class="text-slate-600 mt-2">{{ test.instructions }}</p>
        <p class="mt-2">الدرجة الكلية: {{ test.maxGrade }}</p>

        <div *ngIf="!attempt" class="mt-6">
          <button class="bg-orange-600 text-white px-5 py-2 rounded" (click)="start()">بدء الاختبار</button>
        </div>

        <div *ngIf="attempt?.state === 'draft'" class="mt-6 space-y-6">
          <fieldset *ngFor="let question of test.questions; let i = index" class="border rounded-lg p-4">
            <legend class="font-bold px-2">{{ i + 1 }}. {{ question.prompt }} ({{ question.points }})</legend>
            <label *ngFor="let option of question.options" class="block p-2 cursor-pointer">
              <input type="radio" [name]="'q-' + question.id" [value]="option.id"
                [(ngModel)]="selected[question.id]" (change)="save()" />
              <span class="mr-2">{{ option.text }}</span>
            </label>
          </fieldset>
          <button class="bg-emerald-700 text-white px-5 py-2 rounded" [disabled]="saving" (click)="submit()">
            {{ saving ? 'جار الحفظ...' : 'تسليم الاختبار' }}
          </button>
        </div>

        <div *ngIf="attempt && attempt.state !== 'draft'" class="mt-6 rounded-lg bg-slate-100 p-4">
          <strong>تم تسليم الاختبار.</strong>
          <p *ngIf="attempt.state !== 'released'">ستظهر الدرجة بعد اعتماد المعلم ونشرها.</p>
          <p *ngIf="attempt.state === 'released'">الدرجة: {{ attempt.score }} / {{ test.maxGrade }}</p>
          <p *ngIf="attempt.feedback">ملاحظات المعلم: {{ attempt.feedback }}</p>
        </div>
      </section>
    </main>
  `,
})
export class StudentTestComponent implements OnInit {
  test: StudentTest | null = null;
  attempt: TestAttempt | null = null;
  selected: Record<number, number | null> = {};
  loading = true;
  saving = false;
  error = '';

  constructor(private route: ActivatedRoute, private assessments: AssessmentService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.assessments.getTest(id).subscribe({
      next: response => {
        if (!response.data) return;
        this.test = response.data;
        this.attempt = response.data.attempt;
        for (const answer of this.attempt?.answers ?? []) this.selected[answer.questionId] = answer.selectedOptionId;
      },
      error: error => this.error = error.status === 403 ? 'يجب التسجيل في الكورس أولاً.' : 'تعذر تحميل الاختبار.',
      complete: () => this.loading = false,
    });
  }

  start(): void {
    if (!this.test) return;
    this.assessments.startTest(this.test.id).subscribe({
      next: response => this.attempt = response.data ?? this.attempt,
      error: () => this.error = 'تعذر بدء الاختبار.',
    });
  }

  save(): void {
    if (!this.attempt || !this.test) return;
    const answers = this.test.questions.map(question => ({
      questionId: question.id,
      selectedOptionId: this.selected[question.id] ?? null,
    }));
    this.saving = true;
    this.assessments.saveAnswers(this.attempt.id, answers).subscribe({
      next: response => this.attempt = response.data ?? this.attempt,
      error: () => this.error = 'تعذر حفظ الإجابات.',
      complete: () => this.saving = false,
    });
  }

  submit(): void {
    if (!this.attempt || !confirm('هل تريد تسليم الاختبار نهائياً؟')) return;
    this.saving = true;
    const answers = (this.test?.questions ?? []).map(question => ({
      questionId: question.id,
      selectedOptionId: this.selected[question.id] ?? null,
    }));
    this.assessments.saveAnswers(this.attempt.id, answers).subscribe({
      next: () => this.assessments.submitTest(this.attempt!.id).subscribe({
        next: response => this.attempt = response.data ?? this.attempt,
        error: () => this.error = 'تعذر تسليم الاختبار.',
        complete: () => this.saving = false,
      }),
      error: () => {
        this.error = 'تعذر حفظ الإجابات.';
        this.saving = false;
      },
    });
  }
}
