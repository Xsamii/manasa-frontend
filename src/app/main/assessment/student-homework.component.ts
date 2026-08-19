import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssessmentService, HomeworkDetail } from '../../shared/services/assessment.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="max-w-3xl mx-auto p-6" dir="rtl">
      <a [routerLink]="['/courses', homework?.courseId]" class="text-orange-600">العودة إلى الكورس</a>
      <p *ngIf="loading" class="mt-8">جار تحميل الواجب...</p>
      <p *ngIf="error" class="mt-8 text-red-700">{{ error }}</p>
      <section *ngIf="homework" class="mt-6 bg-white rounded-xl shadow p-6">
        <h1 class="text-2xl font-bold">{{ homework.title }}</h1>
        <p class="mt-2 text-slate-600">{{ homework.instructions }}</p>
        <p class="mt-2">الدرجة الكلية: {{ homework.maxGrade }}</p>

        <form *ngIf="!homework.submission || homework.submission.state === 'draft'" class="mt-6 space-y-4" (ngSubmit)="save(true)">
          <label class="block">
            <span class="font-semibold">إجابة نصية</span>
            <textarea [(ngModel)]="text" name="text" rows="8" maxlength="20000"
              class="mt-1 w-full border rounded-lg p-3"></textarea>
          </label>
          <label class="block">
            <span class="font-semibold">رابط مرفق آمن (HTTPS)</span>
            <input [(ngModel)]="attachmentUrl" name="attachmentUrl" type="url" pattern="https://.*"
              placeholder="https://..." class="mt-1 w-full border rounded-lg p-3" />
          </label>
          <label class="block">
            <span class="font-semibold">اسم المرفق</span>
            <input [(ngModel)]="attachmentName" name="attachmentName" maxlength="255"
              class="mt-1 w-full border rounded-lg p-3" />
          </label>
          <div class="flex gap-3">
            <button type="button" class="border px-5 py-2 rounded" [disabled]="saving" (click)="save(false)">حفظ كمسودة</button>
            <button type="submit" class="bg-emerald-700 text-white px-5 py-2 rounded" [disabled]="saving">تسليم الواجب</button>
          </div>
        </form>

        <div *ngIf="homework.submission && homework.submission.state !== 'draft'" class="mt-6 bg-slate-100 rounded-lg p-4">
          <strong>تم تسليم الواجب.</strong>
          <p *ngIf="homework.submission.state !== 'released'">الدرجة مخفية حتى ينشرها المعلم.</p>
          <p *ngIf="homework.submission.state === 'released'">الدرجة: {{ homework.submission.score }} / {{ homework.maxGrade }}</p>
          <p *ngIf="homework.submission.feedback">ملاحظات المعلم: {{ homework.submission.feedback }}</p>
        </div>
      </section>
    </main>
  `,
})
export class StudentHomeworkComponent implements OnInit {
  homework: HomeworkDetail | null = null;
  text = '';
  attachmentUrl = '';
  attachmentName = '';
  loading = true;
  saving = false;
  error = '';

  constructor(private route: ActivatedRoute, private assessments: AssessmentService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.assessments.getHomework(id).subscribe({
      next: response => {
        if (!response.data) return;
        this.homework = response.data;
        this.text = response.data.submission?.text ?? '';
        this.attachmentUrl = response.data.submission?.attachment?.url ?? '';
        this.attachmentName = response.data.submission?.attachment?.name ?? '';
      },
      error: error => this.error = error.status === 403 ? 'يجب التسجيل في الكورس أولاً.' : 'تعذر تحميل الواجب.',
      complete: () => this.loading = false,
    });
  }

  save(submit: boolean): void {
    if (!this.homework) return;
    if (submit && !confirm('هل تريد تسليم الواجب نهائياً؟')) return;
    this.saving = true;
    this.error = '';
    this.assessments.saveHomework(this.homework.id, {
      text: this.text,
      attachmentUrl: this.attachmentUrl || undefined,
      attachmentName: this.attachmentName || undefined,
      submit,
    }).subscribe({
      next: response => {
        if (this.homework && response.data) this.homework.submission = response.data;
      },
      error: error => this.error = error.error?.message || 'تعذر حفظ الواجب.',
      complete: () => this.saving = false,
    });
  }
}
