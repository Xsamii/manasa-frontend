import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserRole } from '../../shared/models/user.model';
import { STUDY_YEAR_OPTIONS } from '../../shared/models/study-year';
import { userInitials } from '../../shared/utils/user-initials';
import { PageIntroComponent } from '../../shared/components/page-intro/page-intro.component';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageIntroComponent],
  template: `
    <main class="max-w-3xl mx-auto p-6" dir="rtl">
      <header class="flex items-center gap-4 mb-8">
        <span class="w-16 h-16 rounded-full bg-orange-500 text-white text-2xl font-bold flex items-center justify-center">
          {{ initials }}
        </span>
        <div>
          <h1 class="text-3xl font-bold">حسابي</h1>
          <p class="text-slate-600">{{ currentName }} · {{ roleLabel }}</p>
        </div>
      </header>
      <app-page-intro
        *ngIf="canEditAccount"
        text="حدّث اسمك وصفك الدراسي ليظهر الكتالوج المناسب. غيّر كلمة المرور من هنا، وأنهِ جلسات الأجهزة الأخرى من صفحة الأمان إذا لزم.">
      </app-page-intro>
      <p *ngIf="!canEditAccount" class="bg-amber-50 text-amber-800 rounded-lg p-4 mb-6">
        تعديل البيانات وتغيير كلمة المرور مربوطان بصلاحية من المعلم وغير متاحين حالياً.
      </p>

      <p *ngIf="profileMessage" class="mb-4 rounded-lg p-3" [class.bg-emerald-50]="!profileError" [class.text-emerald-800]="!profileError" [class.bg-red-50]="profileError" [class.text-red-700]="profileError">
        {{ profileMessage }}
      </p>

      <form *ngIf="canEditAccount" class="bg-white rounded-2xl border p-6 space-y-4 mb-8" [formGroup]="profileForm" (ngSubmit)="saveProfile()">
        <h2 class="text-xl font-bold">البيانات الشخصية</h2>
        <label class="block">
          <span class="text-sm text-slate-600">الاسم</span>
          <input class="field" formControlName="fullName">
        </label>
        <label class="block">
          <span class="text-sm text-slate-600">البريد الإلكتروني</span>
          <input class="field" type="email" formControlName="email">
        </label>
        <label class="block">
          <span class="text-sm text-slate-600">رقم الهاتف</span>
          <input class="field" formControlName="phoneNumber">
        </label>
        <ng-container *ngIf="isStudent">
          <label class="block">
            <span class="text-sm text-slate-600">المدرسة</span>
            <input class="field" formControlName="schoolName">
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">السنة الدراسية</span>
            <select class="field" formControlName="studyYear">
              <option *ngFor="let year of years" [value]="year.value">{{ year.label }}</option>
            </select>
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">المحافظة</span>
            <input class="field" formControlName="governorate">
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">العنوان</span>
            <input class="field" formControlName="address">
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">مهنة ولي الأمر</span>
            <input class="field" formControlName="jobTitle">
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">هاتف الأب</span>
            <input class="field" formControlName="fatherPhoneNumber">
          </label>
          <label class="block">
            <span class="text-sm text-slate-600">هاتف الأم</span>
            <input class="field" formControlName="motherPhoneNumber">
          </label>
        </ng-container>
        <label *ngIf="isTeacher" class="block">
          <span class="text-sm text-slate-600">التخصص</span>
          <input class="field" formControlName="specialization">
        </label>
        <button class="btn" [disabled]="profileForm.invalid || savingProfile">حفظ البيانات</button>
      </form>

      <p *ngIf="passwordMessage" class="mb-4 rounded-lg p-3" [class.bg-emerald-50]="!passwordError" [class.text-emerald-800]="!passwordError" [class.bg-red-50]="passwordError" [class.text-red-700]="passwordError">
        {{ passwordMessage }}
      </p>

      <form *ngIf="canEditAccount" class="bg-white rounded-2xl border p-6 space-y-4" [formGroup]="passwordForm" (ngSubmit)="savePassword()">
        <h2 class="text-xl font-bold">تغيير كلمة المرور</h2>
        <label class="block">
          <span class="text-sm text-slate-600">كلمة المرور الحالية</span>
          <input class="field" type="password" formControlName="currentPassword">
        </label>
        <label class="block">
          <span class="text-sm text-slate-600">كلمة المرور الجديدة</span>
          <input class="field" type="password" formControlName="password">
        </label>
        <label class="block">
          <span class="text-sm text-slate-600">تأكيد كلمة المرور</span>
          <input class="field" type="password" formControlName="confirmPassword">
        </label>
        <button class="btn" [disabled]="passwordForm.invalid || savingPassword">تحديث كلمة المرور</button>
      </form>
    </main>
  `,
  styles: [`
    .field{display:block;width:100%;margin-top:.35rem;border:1px solid #cbd5e1;border-radius:.75rem;padding:.75rem}
    .btn{background:#ea580c;color:white;border-radius:.75rem;padding:.75rem 1.25rem}
    .btn:disabled{opacity:.5}
  `],
})
export class AccountSettingsComponent implements OnInit {
  readonly years = STUDY_YEAR_OPTIONS;
  savingProfile = false;
  savingPassword = false;
  profileMessage = '';
  passwordMessage = '';
  profileError = false;
  passwordError = false;
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  profileForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    schoolName: [''],
    studyYear: [''],
    governorate: [''],
    address: [''],
    specialization: [''],
    jobTitle: [''],
    fatherPhoneNumber: [''],
    motherPhoneNumber: [''],
  });
  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  get isStudent(): boolean {
    return this.auth.currentUser?.role === UserRole.STUDENT;
  }

  get isTeacher(): boolean {
    return this.auth.currentUser?.role === UserRole.TEACHER;
  }

  get currentName(): string {
    return this.auth.currentUser?.fullName || '';
  }

  get initials(): string {
    return userInitials(this.currentName);
  }

  get canEditAccount(): boolean {
    if (this.isTeacher) return true;
    return this.auth.currentUser?.profileAccessEnabled !== false;
  }

  get roleLabel(): string {
    return this.isTeacher ? 'معلم' : 'طالب';
  }

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: response => {
        if (response.success) this.patchProfile();
      },
      error: () => this.patchProfile(),
    });
    this.patchProfile();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile = true;
    this.profileMessage = '';
    const value = this.profileForm.getRawValue();
    const payload = this.isTeacher
      ? {
          fullName: value.fullName,
          email: value.email,
          phoneNumber: value.phoneNumber,
          specialization: value.specialization,
        }
      : {
          fullName: value.fullName,
          email: value.email,
          phoneNumber: value.phoneNumber,
          schoolName: value.schoolName,
          studyYear: value.studyYear,
          governorate: value.governorate,
          address: value.address,
          jobTitle: value.jobTitle,
          fatherPhoneNumber: value.fatherPhoneNumber,
          motherPhoneNumber: value.motherPhoneNumber,
        };
    this.auth.updateProfile(payload).subscribe({
      next: response => {
        this.savingProfile = false;
        this.profileError = !response.success;
        this.profileMessage = response.success ? 'تم حفظ بيانات الحساب.' : response.message;
      },
      error: error => {
        this.savingProfile = false;
        this.profileError = true;
        this.profileMessage = error.error?.message ?? 'تعذر حفظ البيانات.';
      },
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) return;
    const value = this.passwordForm.getRawValue();
    if (value.password !== value.confirmPassword) {
      this.passwordError = true;
      this.passwordMessage = 'كلمتا المرور غير متطابقتين.';
      return;
    }
    this.savingPassword = true;
    this.passwordMessage = '';
    this.auth.changePassword(value).subscribe({
      next: response => {
        this.savingPassword = false;
        this.passwordError = !response.success;
        this.passwordMessage = response.success ? 'تم تحديث كلمة المرور.' : response.message;
        if (response.success) this.passwordForm.reset();
      },
      error: error => {
        this.savingPassword = false;
        this.passwordError = true;
        this.passwordMessage = error.error?.message ?? 'تعذر تحديث كلمة المرور.';
      },
    });
  }

  private patchProfile(): void {
    const user = this.auth.currentUser;
    if (!user) return;
    this.profileForm.patchValue({
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      schoolName: user.schoolName || '',
      studyYear: user.studyYear || '',
      governorate: user.governorate || '',
      address: user.address || '',
      specialization: user.specialization || '',
      jobTitle: user.jobTitle || '',
      fatherPhoneNumber: user.fatherPhoneNumber || '',
      motherPhoneNumber: user.motherPhoneNumber || '',
    });
  }
}
