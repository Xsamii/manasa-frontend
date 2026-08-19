import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TeacherAuthoringService } from './teacher-authoring.service';
import { TeacherCourse } from './teacher-authoring.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section>
      <div class="flex items-center justify-between mb-6">
        <div><h1 class="text-3xl font-bold">كورساتي</h1><p class="text-slate-500">أنشئ المحتوى وانشره عندما يصبح جاهزاً.</p></div>
        <button class="btn" (click)="showCreate = !showCreate">+ كورس جديد</button>
      </div>
      <form *ngIf="showCreate" [formGroup]="form" (ngSubmit)="create()" class="card grid md:grid-cols-2 gap-4 mb-6">
        <input class="field" formControlName="title" placeholder="اسم الكورس">
        <select class="field" formControlName="studyYear">
          <option *ngFor="let year of years" [value]="year">{{ year }}</option>
        </select>
        <textarea class="field md:col-span-2" formControlName="description" placeholder="وصف الكورس"></textarea>
        <input class="field" type="number" min="0" step="0.01" formControlName="price" placeholder="السعر (0 = مجاني)">
        <select class="field" formControlName="currency"><option value="EGP">EGP</option></select>
        <button class="btn md:col-span-2" [disabled]="form.invalid || saving">حفظ المسودة</button>
      </form>
      <p *ngIf="error" class="text-red-600 mb-4">{{ error }}</p>
      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        <article *ngFor="let course of courses" class="card">
          <div class="flex justify-between gap-3"><h2 class="font-bold text-xl">{{ course.title }}</h2>
            <span class="rounded-full px-3 py-1 text-xs" [class.bg-green-100]="course.status === 'published'" [class.bg-amber-100]="course.status === 'draft'">{{ course.status === 'published' ? 'منشور' : 'مسودة' }}</span>
          </div>
          <p class="text-slate-600 my-3 line-clamp-2">{{ course.description }}</p>
          <p class="text-sm text-slate-500">{{ course.lessonsCount }} جلسات · {{ course.studentsCount }} طلاب</p>
          <p class="text-sm font-semibold text-orange-600 mt-2">{{ course.price === 0 ? 'مجاني' : course.price + ' ' + course.currency }}</p>
          <div class="flex gap-2 mt-5">
            <a class="btn flex-1 text-center" [routerLink]="['/teacher/courses', course.id]">تحرير</a>
            <button class="danger" (click)="remove(course)">حذف</button>
          </div>
        </article>
      </div>
      <p *ngIf="!courses.length && !loading" class="text-center text-slate-500 py-16">لا توجد كورسات بعد.</p>
    </section>
  `,
  styles: [`
    .card{background:white;border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem}
    .field{border:1px solid #cbd5e1;border-radius:.65rem;padding:.75rem;width:100%}
    .btn{background:#ea580c;color:white;border-radius:.65rem;padding:.7rem 1rem}
    .btn:disabled{opacity:.5}.danger{color:#b91c1c;padding:.5rem}
  `],
})
export class TeacherDashboardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(TeacherAuthoringService);
  courses: TeacherCourse[] = [];
  years = ['1st Primary', '2nd Primary', '3rd Primary', '1st Secondary', '2nd Secondary', '3rd Secondary'];
  showCreate = false;
  saving = false;
  loading = true;
  error = '';
  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    studyYear: [this.years[0], Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    currency: ['EGP', Validators.required],
  });

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.api.listCourses().subscribe({
      next: response => { this.courses = response.data ?? []; this.loading = false; },
      error: error => { this.error = error.error?.message ?? 'تعذر تحميل الكورسات'; this.loading = false; },
    });
  }
  create(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.createCourse(this.form.getRawValue()).subscribe({
      next: () => { this.form.reset({ studyYear: this.years[0], price: 0, currency: 'EGP' }); this.showCreate = false; this.saving = false; this.load(); },
      error: error => { this.error = error.error?.message ?? 'تعذر إنشاء الكورس'; this.saving = false; },
    });
  }
  remove(course: TeacherCourse): void {
    if (!confirm(`حذف "${course.title}"؟`)) return;
    this.api.deleteCourse(course.id).subscribe({ next: () => this.load(), error: () => this.error = 'تعذر حذف الكورس' });
  }
}
