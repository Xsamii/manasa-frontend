import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudyYearPipe } from '../shared/pipes/study-year.pipe';
import { TeacherOpsService, Center, ReviewStudent } from './teacher-ops.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, StudyYearPipe],
  template: `
    <section dir="rtl">
      <h1 class="text-3xl font-bold mb-2">طلبات التسجيل وصلاحيات الحساب</h1>
      <p class="text-slate-500 mb-6">راجع البيانات، تواصل مع ولي الأمر، ثم فعّل الحساب. يمكنك ربط الطالب بسنتر ومنع تعديل الحساب في أي وقت.</p>
      <p *ngIf="error" class="bg-red-50 text-red-700 p-3 rounded mb-4">{{ error }}</p>

      <form class="card flex gap-3 mb-6" (ngSubmit)="addCenter()">
        <input class="field" [(ngModel)]="centerName" name="centerName" placeholder="اسم سنتر جديد">
        <button class="btn" [disabled]="!centerName.trim()">إضافة سنتر</button>
      </form>
      <div class="flex flex-wrap gap-2 mb-8">
        <span *ngFor="let center of centers" class="px-3 py-1 rounded-full bg-slate-100">{{ center.name }}</span>
      </div>

      <h2 class="font-bold text-xl mb-3">بانتظار المراجعة</h2>
      <article *ngFor="let student of pending" class="card mb-4">
        <div class="flex justify-between gap-3">
          <div>
            <h3 class="font-bold text-lg">{{ student.fullName }}</h3>
            <p class="text-sm text-slate-500">{{ student.email }} · {{ student.phoneNumber }}</p>
            <p class="text-sm">المدرسة: {{ student.schoolName }} · {{ student.studyYear | studyYear }}</p>
            <p class="text-sm">الأب: {{ student.parentUnavailable === 'father' ? 'غير متوفر' : student.fatherPhoneNumber }}</p>
            <p class="text-sm">الأم: {{ student.parentUnavailable === 'mother' ? 'غير متوفر' : student.motherPhoneNumber }}</p>
            <p class="text-sm">مهنة ولي الأمر: {{ student.jobTitle }}</p>
          </div>
          <button class="link" (click)="openIdentity(student)">بطاقة / شهادة الميلاد</button>
        </div>
        <div class="flex flex-wrap gap-3 mt-4">
          <select class="field max-w-xs" [(ngModel)]="centerChoice[student.id]" name="c{{ student.id }}">
            <option [ngValue]="undefined">بدون سنتر</option>
            <option *ngFor="let center of centers" [ngValue]="center.id">{{ center.name }}</option>
          </select>
          <button class="btn" (click)="approve(student)">تفعيل بعد تأكيد ولي الأمر</button>
          <button class="danger" (click)="reject(student)">رفض</button>
        </div>
      </article>
      <p *ngIf="!pending.length" class="text-slate-500 mb-8">لا توجد طلبات معلّقة.</p>

      <h2 class="font-bold text-xl mb-3">صلاحية حسابي للطلاب</h2>
      <article *ngFor="let student of approved" class="border-t py-3 flex justify-between gap-3">
        <div>
          <strong>{{ student.fullName }}</strong>
          <span class="block text-sm text-slate-500">{{ student.center?.name || 'بدون سنتر' }} · تعديل الحساب {{ student.profileAccessEnabled ? 'متاح' : 'مغلق من المعلم' }}</span>
        </div>
        <button class="link" (click)="toggleAccess(student)">
          {{ student.profileAccessEnabled ? 'إغلاق حسابي' : 'فتح حسابي' }}
        </button>
      </article>
    </section>
  `,
  styles: [`
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem}
    .field{border:1px solid #cbd5e1;border-radius:.6rem;padding:.7rem;width:100%}
    .btn{background:#ea580c;color:#fff;border-radius:.6rem;padding:.7rem 1rem}
    .link{color:#0369a1}.danger{color:#b91c1c}
  `],
})
export class TeacherStudentsComponent implements OnInit {
  private readonly api = inject(TeacherOpsService);
  pending: ReviewStudent[] = [];
  approved: ReviewStudent[] = [];
  centers: Center[] = [];
  centerChoice: Record<number, number | undefined> = {};
  centerName = '';
  error = '';

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.api.listCenters().subscribe({
      next: response => { if (response.success) this.centers = response.data; },
    });
    this.api.pendingStudents().subscribe({
      next: response => { if (response.success) this.pending = response.data; },
      error: error => this.error = error.error?.message ?? 'تعذر تحميل الطلبات',
    });
    this.api.allStudents().subscribe({
      next: response => {
        if (response.success) {
          this.approved = response.data.filter(item => item.accountStatus === 'approved');
        }
      },
    });
  }

  addCenter(): void {
    if (!this.centerName.trim()) return;
    this.api.createCenter(this.centerName.trim()).subscribe({
      next: () => { this.centerName = ''; this.refresh(); },
      error: error => this.error = error.error?.message ?? 'تعذر إضافة السنتر',
    });
  }

  approve(student: ReviewStudent): void {
    this.api.approve(student.id, {
      centerId: this.centerChoice[student.id],
      profileAccessEnabled: true,
    }).subscribe({ next: () => this.refresh(), error: error => this.error = error.error?.message });
  }

  reject(student: ReviewStudent): void {
    const reason = prompt('سبب الرفض') || undefined;
    this.api.reject(student.id, reason).subscribe({ next: () => this.refresh() });
  }

  toggleAccess(student: ReviewStudent): void {
    this.api.setAccess(student.id, !student.profileAccessEnabled).subscribe({ next: () => this.refresh() });
  }

  openIdentity(student: ReviewStudent): void {
    this.api.downloadIdentity(student.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: () => this.error = 'تعذر فتح صورة البطاقة أو شهادة الميلاد',
    });
  }
}
