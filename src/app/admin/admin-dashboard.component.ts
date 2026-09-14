import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from './admin.service';
import { STUDY_YEAR_OPTIONS } from '../shared/models/study-year';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div dir="rtl" class="grid md:grid-cols-2 gap-6">
      <section class="card">
        <h2 class="font-bold text-lg mb-3">إضافة معلم</h2>
        <p *ngIf="teacherError" class="error">{{ teacherError }}</p>
        <p *ngIf="teacherSuccess" class="success">{{ teacherSuccess }}</p>
        <form [formGroup]="teacherForm" (ngSubmit)="addTeacher()" class="space-y-3">
          <input class="field" placeholder="الاسم الكامل" formControlName="fullName">
          <input class="field" type="email" placeholder="البريد الإلكتروني" formControlName="email">
          <input class="field" placeholder="التخصص" formControlName="specialization">
          <input class="field" placeholder="رقم الهاتف" formControlName="phoneNumber">
          <input class="field" type="password" placeholder="كلمة المرور" formControlName="password">
          <button class="btn" [disabled]="teacherForm.invalid || teacherLoading">
            {{ teacherLoading ? 'جارٍ الإضافة...' : 'إضافة المعلم' }}
          </button>
        </form>
      </section>

      <section class="card">
        <h2 class="font-bold text-lg mb-3">إضافة طالب</h2>
        <p *ngIf="studentError" class="error">{{ studentError }}</p>
        <p *ngIf="studentSuccess" class="success">{{ studentSuccess }}</p>
        <form [formGroup]="studentForm" (ngSubmit)="addStudent()" class="space-y-3">
          <input class="field" placeholder="الاسم الكامل" formControlName="fullName">
          <input class="field" type="email" placeholder="البريد الإلكتروني" formControlName="email">
          <input class="field" placeholder="رقم الهاتف" formControlName="phoneNumber">
          <select class="field" formControlName="studyYear">
            <option value="" disabled>الصف الدراسي</option>
            <option *ngFor="let year of years" [value]="year.value">{{ year.label }}</option>
          </select>
          <select class="field" formControlName="gender">
            <option value="" disabled>النوع</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
          <input class="field" placeholder="المدرسة (اختياري)" formControlName="schoolName">
          <input class="field" type="password" placeholder="كلمة المرور" formControlName="password">
          <button class="btn" [disabled]="studentForm.invalid || studentLoading">
            {{ studentLoading ? 'جارٍ الإضافة...' : 'إضافة الطالب' }}
          </button>
        </form>
      </section>
    </div>
  `,
  styles: [`
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem}
    .field{border:1px solid #cbd5e1;border-radius:.6rem;padding:.65rem;width:100%}
    .btn{width:100%;background:#0f172a;color:#fff;border-radius:.6rem;padding:.7rem 1rem}
    .btn:disabled{opacity:.6}
    .error{background:#fef2f2;color:#b91c1c;padding:.6rem;border-radius:.5rem;font-size:.85rem;margin-bottom:.5rem}
    .success{background:#f0fdf4;color:#166534;padding:.6rem;border-radius:.5rem;font-size:.85rem;margin-bottom:.5rem}
  `],
})
export class AdminDashboardComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminService);
  readonly years = STUDY_YEAR_OPTIONS;

  teacherLoading = false;
  teacherError = '';
  teacherSuccess = '';
  teacherForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    specialization: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    password: ['', Validators.required],
  });

  studentLoading = false;
  studentError = '';
  studentSuccess = '';
  studentForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    studyYear: ['', Validators.required],
    gender: ['', Validators.required],
    schoolName: [''],
    password: ['', Validators.required],
  });

  addTeacher(): void {
    if (this.teacherForm.invalid) return;
    this.teacherLoading = true;
    this.teacherError = '';
    this.teacherSuccess = '';
    this.api.createTeacher(this.teacherForm.getRawValue()).subscribe({
      next: response => {
        this.teacherLoading = false;
        if (!response.success) {
          this.teacherError = response.message || 'تعذرت إضافة المعلم';
          return;
        }
        this.teacherSuccess = 'تم إضافة المعلم بنجاح';
        this.teacherForm.reset();
      },
      error: err => {
        this.teacherLoading = false;
        this.teacherError = err.error?.message ?? 'تعذرت إضافة المعلم';
      },
    });
  }

  addStudent(): void {
    if (this.studentForm.invalid) return;
    this.studentLoading = true;
    this.studentError = '';
    this.studentSuccess = '';
    const value = this.studentForm.getRawValue();
    this.api.createStudent({ ...value, schoolName: value.schoolName || undefined }).subscribe({
      next: response => {
        this.studentLoading = false;
        if (!response.success) {
          this.studentError = response.message || 'تعذرت إضافة الطالب';
          return;
        }
        this.studentSuccess = 'تم إضافة الطالب بنجاح';
        this.studentForm.reset();
      },
      error: err => {
        this.studentLoading = false;
        this.studentError = err.error?.message ?? 'تعذرت إضافة الطالب';
      },
    });
  }
}
