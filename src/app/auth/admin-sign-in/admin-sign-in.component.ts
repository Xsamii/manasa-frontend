import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserRole } from '../../shared/models/user.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="wrap" dir="rtl">
      <form class="card" [formGroup]="form" (ngSubmit)="submit()">
        <h1 class="title">دخول الإدارة</h1>
        <p *ngIf="error" class="error">{{ error }}</p>
        <label class="label">البريد الإلكتروني</label>
        <input class="field" type="email" formControlName="email" autocomplete="email">
        <label class="label">كلمة المرور</label>
        <input class="field" type="password" formControlName="password" autocomplete="current-password">
        <button class="btn" [disabled]="form.invalid || loading">{{ loading ? 'جارٍ الدخول...' : 'دخول' }}</button>
      </form>
    </div>
  `,
  styles: [`
    .wrap{min-height:100vh;display:grid;place-items:center;background:#0f172a;padding:1rem}
    .card{background:#fff;border-radius:1rem;padding:2rem;width:100%;max-width:24rem}
    .title{font-size:1.5rem;font-weight:700;margin-bottom:1rem}
    .label{display:block;font-size:.85rem;margin:.75rem 0 .25rem;color:#475569}
    .field{border:1px solid #cbd5e1;border-radius:.6rem;padding:.65rem;width:100%}
    .btn{margin-top:1.25rem;width:100%;background:#0f172a;color:#fff;border-radius:.6rem;padding:.75rem}
    .btn:disabled{opacity:.6}
    .error{background:#fef2f2;color:#b91c1c;padding:.6rem;border-radius:.5rem;font-size:.85rem}
  `],
})
export class AdminSignInComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = false;
  error = '';
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.getRawValue();
    this.auth.signIn(email, password, UserRole.ADMIN).subscribe({
      next: response => {
        this.loading = false;
        if (!response.success) {
          this.error = response.message || 'بيانات الدخول غير صحيحة';
          return;
        }
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(returnUrl || '/admin');
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message ?? 'بيانات الدخول غير صحيحة';
      },
    });
  }
}
