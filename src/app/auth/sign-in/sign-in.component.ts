import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { UserRole } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sign-in',
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
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  role: UserRole = UserRole.STUDENT;
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
    this.route.data.subscribe(data => {
      this.role = data['role'] === UserRole.TEACHER
        ? UserRole.TEACHER
        : UserRole.STUDENT;
      this.loginForm.patchValue({ email: '', password: '' });
      this.errorMessage = '';
    });
  }

  fillDemoAccount(): void {
    this.loginForm.patchValue({
      email: this.demoAccount.email,
      password: this.demoPassword,
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
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
                  : '/dashboard',
            );
          } else {
            this.errorMessage = response.message || 'حدث خطأ أثناء تسجيل الدخول';
          }
        },
        error: error => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'حدث خطأ أثناء تسجيل الدخول';
        }
      });
    } else {
      this.markAllFieldsAsTouched();
    }
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
