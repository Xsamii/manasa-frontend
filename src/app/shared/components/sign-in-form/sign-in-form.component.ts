import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { environment } from '../../../../environments/environment';
import { UserRole } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    MessageModule,
  ],
  templateUrl: './sign-in-form.component.html',
})
export class SignInFormComponent implements OnInit {
  @Input() embedded = false;
  @Input() initialRole: UserRole | null = null;

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  role: UserRole = UserRole.STUDENT;
  readonly studentRole = UserRole.STUDENT;
  readonly teacherRole = UserRole.TEACHER;
  readonly showDemoHint = !environment.production;
  readonly demoPassword = 'Demo@1234';
  readonly demoStudent = {
    name: 'سارة علي',
    email: 'sara.student@manasa.test',
  };
  readonly demoTeacher = {
    name: 'أحمد محمود',
    email: 'ahmed.math@manasa.test',
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  get isTeacher(): boolean {
    return this.role === UserRole.TEACHER;
  }

  get demoAccount() {
    return this.isTeacher ? this.demoTeacher : this.demoStudent;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });

    if (this.initialRole) {
      this.role = this.initialRole;
      return;
    }

    this.route.data.subscribe(data => {
      this.setRole(data['role'] === UserRole.TEACHER ? UserRole.TEACHER : UserRole.STUDENT);
    });
  }

  setRole(role: UserRole): void {
    this.role = role;
    this.loginForm?.patchValue({ email: '', password: '' });
    this.errorMessage = '';
  }

  fillDemoAccount(): void {
    this.loginForm.patchValue({
      email: this.demoAccount.email,
      password: this.demoPassword,
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.authService.signIn(email, password, this.role).subscribe({
      next: response => {
        this.isLoading = false;
        if (response.success) {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          void this.router.navigateByUrl(
            returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
              ? returnUrl
              : this.isTeacher
                ? '/teacher'
              : '/courses?welcome=1',
          );
        } else {
          this.errorMessage = response.message || 'حدث خطأ أثناء تسجيل الدخول';
        }
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'حدث خطأ أثناء تسجيل الدخول';
      },
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'هذا الحقل مطلوب';
      if (field.errors['email']) return 'البريد الإلكتروني غير صحيح';
    }
    return '';
  }
}
