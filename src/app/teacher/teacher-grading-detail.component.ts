import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssessmentService, AssessmentType } from '../shared/services/assessment.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section dir="rtl">
      <a routerLink="/teacher/grading" class="text-orange-700">العودة إلى طابور التصحيح</a>
      <p *ngIf="loading" class="mt-8">جار التحميل...</p>
      <p *ngIf="error" class="mt-8 text-red-700">{{ error }}</p>
      <article *ngIf="detail" class="mt-6 bg-white rounded-xl shadow p-6">
        <h1 class="text-2xl font-bold">{{ detail.title }}</h1>
        <p>{{ detail.student.fullName }} — {{ detail.courseTitle }}</p>

        <div *ngIf="type === 'homework'" class="mt-6 border rounded-lg p-4">
          <h2 class="font-bold">إجابة الطالب</h2>
          <p class="whitespace-pre-wrap mt-2">{{ detail.text || 'لا توجد إجابة نصية.' }}</p>
          <a *ngIf="detail.attachment" [href]="detail.attachment.url" target="_blank" rel="noopener noreferrer"
            class="inline-block mt-3 text-orange-700">فتح المرفق: {{ detail.attachment.name || 'مرفق' }}</a>
        </div>

        <div *ngIf="type === 'test'" class="mt-6 space-y-3">
          <article *ngFor="let answer of detail.answers" class="border rounded-lg p-4">
            <h2 class="font-bold">{{ answer.question }}</h2>
            <p>إجابة الطالب: {{ optionText(answer, answer.selectedOptionId) }}</p>
            <p>الإجابة الصحيحة: {{ optionText(answer, answer.correctOptionId) }}</p>
            <p>{{ answer.awardedPoints }} / {{ answer.points }}</p>
          </article>
        </div>

        <form class="mt-6 grid gap-4" (ngSubmit)="grade()">
          <label>الدرجة (من {{ detail.maxGrade }})
            <input type="number" min="0" [max]="detail.maxGrade" step="0.01" required [(ngModel)]="score" name="score"
              class="block mt-1 border rounded p-2 w-48" />
          </label>
          <label>ملاحظات المعلم
            <textarea [(ngModel)]="feedback" name="feedback" maxlength="10000" rows="5"
              class="block mt-1 border rounded p-3 w-full"></textarea>
          </label>
          <div class="flex gap-3">
            <button type="submit" class="bg-slate-800 text-white px-5 py-2 rounded" [disabled]="saving">حفظ التصحيح</button>
            <button type="button" class="bg-emerald-700 text-white px-5 py-2 rounded"
              [disabled]="saving || detail.state !== 'graded'" (click)="release()">نشر النتيجة</button>
          </div>
        </form>
      </article>
    </section>
  `,
})
export class TeacherGradingDetailComponent implements OnInit {
  type!: AssessmentType;
  id = 0;
  detail: any;
  score = 0;
  feedback = '';
  loading = true;
  saving = false;
  error = '';

  constructor(private route: ActivatedRoute, private assessments: AssessmentService) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type') as AssessmentType;
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.assessments.getGradingDetail(this.type, this.id).subscribe({
      next: response => {
        this.detail = response.data;
        this.score = response.data.score ?? 0;
        this.feedback = response.data.feedback ?? '';
      },
      error: () => this.error = 'تعذر تحميل التسليم أو أنه لا يتبع أحد كورساتك.',
      complete: () => this.loading = false,
    });
  }

  optionText(answer: any, id: number | null): string {
    return answer.options.find((option: any) => option.id === id)?.text ?? 'لم يجب';
  }

  grade(): void {
    this.saving = true;
    this.assessments.grade(this.type, this.id, Number(this.score), this.feedback).subscribe({
      next: response => this.detail = { ...this.detail, ...response.data, feedback: this.feedback },
      error: error => this.error = error.error?.message || 'تعذر حفظ التصحيح.',
      complete: () => this.saving = false,
    });
  }

  release(): void {
    if (!confirm('هل تريد نشر الدرجة للطالب؟')) return;
    this.saving = true;
    this.assessments.release(this.type, this.id).subscribe({
      next: response => this.detail = { ...this.detail, ...response.data },
      error: () => this.error = 'تعذر نشر النتيجة.',
      complete: () => this.saving = false,
    });
  }
}
