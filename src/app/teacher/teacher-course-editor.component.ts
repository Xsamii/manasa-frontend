import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  ContentType,
  RosterStudent,
  TeacherContent,
  TeacherCourse,
  TeacherSession,
} from './teacher-authoring.model';
import { TeacherAuthoringService } from './teacher-authoring.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <p *ngIf="error" class="bg-red-50 text-red-700 p-3 rounded mb-4">{{ error }}</p>
    <ng-container *ngIf="course">
      <header class="flex flex-wrap items-center gap-3 mb-6">
        <div class="ml-auto"><h1 class="text-3xl font-bold">{{ course.title }}</h1>
          <p class="text-slate-500">{{ course.status === 'published' ? 'منشور' : 'مسودة' }}</p></div>
        <button class="secondary" (click)="preview = !preview">{{ preview ? 'إنهاء المعاينة' : 'معاينة' }}</button>
        <button class="btn" (click)="togglePublish()">{{ course.status === 'published' ? 'إرجاع لمسودة' : 'نشر الكورس' }}</button>
      </header>

      <section *ngIf="preview" class="card mb-6">
        <h2 class="text-2xl font-bold">{{ course.title }}</h2><p class="my-2">{{ course.description }}</p>
        <ol class="list-decimal pr-6"><li *ngFor="let lesson of course.sessions">{{ lesson.title }} — {{ contentCount(lesson) }} عناصر</li></ol>
      </section>

      <div class="grid lg:grid-cols-[1fr_2fr] gap-6">
        <aside class="space-y-6">
          <form class="card space-y-3" [formGroup]="metadataForm" (ngSubmit)="saveMetadata()">
            <h2 class="font-bold text-lg">بيانات الكورس</h2>
            <input class="field" formControlName="title"><textarea class="field" formControlName="description"></textarea>
            <select class="field" formControlName="studyYear"><option *ngFor="let year of years" [value]="year">{{ year }}</option></select>
            <input class="field" type="number" min="0" step="0.01" formControlName="price" placeholder="السعر">
            <select class="field" formControlName="currency"><option value="EGP">EGP</option></select>
            <button class="btn w-full" [disabled]="metadataForm.invalid">حفظ</button>
          </form>
          <section class="card">
            <h2 class="font-bold text-lg mb-3">الطلاب المسجلون ({{ roster.length }})</h2>
            <p *ngIf="!roster.length" class="text-slate-500">لا يوجد طلاب مسجلون حتى الآن.</p>
            <div *ngFor="let student of roster" class="border-t py-2"><b>{{ student.fullName }}</b><small class="block">{{ student.email }}</small></div>
          </section>
        </aside>

        <main>
          <form class="card flex flex-col md:flex-row gap-3 mb-4" [formGroup]="sessionForm" (ngSubmit)="addSession()">
            <input class="field" formControlName="title" placeholder="عنوان الجلسة">
            <input class="field" formControlName="description" placeholder="وصف الجلسة">
            <button class="btn" [disabled]="sessionForm.invalid">إضافة جلسة</button>
          </form>

          <article *ngFor="let lesson of course.sessions; let i = index" class="card mb-4">
            <div class="flex gap-2 items-start">
              <span class="bg-slate-100 rounded px-2 py-1">{{ i + 1 }}</span>
              <div class="ml-auto"><h3 class="font-bold text-xl">{{ lesson.title }}</h3><p class="text-slate-500">{{ lesson.description }}</p></div>
              <button class="link" (click)="editSession(lesson)">تعديل</button>
              <button class="danger" (click)="deleteSession(lesson)">حذف</button>
            </div>
            <div class="grid md:grid-cols-3 gap-3 my-4">
              <div *ngFor="let item of allContent(lesson)" class="border rounded-lg p-3">
                <small>{{ label(item.type) }}</small><b class="block">{{ item.content.title }}</b>
                <button class="link" (click)="editContent(item.type, item.content)">تعديل</button>
                <button class="danger" (click)="deleteContent(item.type, item.content)">حذف</button>
              </div>
            </div>
            <form [formGroup]="contentForm" (ngSubmit)="addContent(lesson)" class="bg-slate-50 rounded-lg p-3 grid md:grid-cols-2 gap-3">
              <select class="field" formControlName="type"><option value="video">فيديو</option><option value="homework">واجب</option><option value="test">اختبار</option></select>
              <input class="field" formControlName="title" placeholder="العنوان">
              <input *ngIf="contentForm.controls.type.value === 'video'" class="field md:col-span-2" formControlName="url" placeholder="https://...">
              <ng-container *ngIf="contentForm.controls.type.value !== 'video'">
                <input class="field" type="number" min="1" formControlName="maxGrade" placeholder="الدرجة القصوى">
                <input class="field" type="datetime-local" formControlName="dateOfDelivery">
                <textarea class="field md:col-span-2" formControlName="instructions" placeholder="التعليمات"></textarea>
                <textarea *ngIf="contentForm.controls.type.value === 'test'" class="field md:col-span-2" rows="6"
                  formControlName="questionsJson"
                  placeholder='الأسئلة بصيغة JSON: [{"prompt":"2+2؟","points":1,"options":[{"text":"4","isCorrect":true},{"text":"3","isCorrect":false}]}]'></textarea>
              </ng-container>
              <button class="btn md:col-span-2">إضافة المحتوى</button>
            </form>
          </article>
          <p *ngIf="!course.sessions?.length" class="text-center text-slate-500 py-10">ابدأ بإضافة أول جلسة.</p>
        </main>
      </div>
    </ng-container>
  `,
  styles: [`
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem}
    .field{border:1px solid #cbd5e1;border-radius:.6rem;padding:.65rem;width:100%}
    .btn,.secondary{border-radius:.6rem;padding:.7rem 1rem}.btn{background:#ea580c;color:#fff}.secondary{background:#e2e8f0}
    .link{color:#0369a1;padding:.35rem}.danger{color:#b91c1c;padding:.35rem}
  `],
})
export class TeacherCourseEditorComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(TeacherAuthoringService);
  course?: TeacherCourse;
  roster: RosterStudent[] = [];
  error = '';
  preview = false;
  readonly years = ['1st Primary', '2nd Primary', '3rd Primary', '1st Secondary', '2nd Secondary', '3rd Secondary'];
  metadataForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    studyYear: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    currency: ['EGP', Validators.required],
  });
  sessionForm = this.fb.nonNullable.group({ title: ['', Validators.required], description: ['', Validators.required] });
  contentForm = this.fb.nonNullable.group({
    type: ['video' as ContentType, Validators.required], title: ['', Validators.required],
    url: [''], maxGrade: [10], dateOfDelivery: [''], instructions: [''], questionsJson: [''],
  });
  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void { this.load(); }
  load(): void {
    forkJoin({ course: this.api.getCourse(this.id), roster: this.api.getRoster(this.id) }).subscribe({
      next: ({ course, roster }) => {
        if (!course.data) { this.error = 'الكورس غير موجود'; return; }
        this.course = course.data; this.roster = roster.data ?? [];
        this.metadataForm.patchValue(course.data);
      },
      error: error => this.error = error.error?.message ?? 'تعذر تحميل الكورس',
    });
  }
  saveMetadata(): void { if (!this.course || this.metadataForm.invalid) return; this.api.updateCourse(this.id, this.metadataForm.getRawValue()).subscribe({ next: () => this.load(), error: () => this.error = 'تعذر الحفظ' }); }
  addSession(): void { if (this.sessionForm.invalid) return; this.api.createSession(this.id, { ...this.sessionForm.getRawValue(), position: this.course?.sessions?.length ?? 0 }).subscribe({ next: () => { this.sessionForm.reset(); this.load(); }, error: () => this.error = 'تعذر إضافة الجلسة' }); }
  editSession(lesson: TeacherSession): void {
    const title = prompt('عنوان الجلسة', lesson.title); if (!title) return;
    const description = prompt('وصف الجلسة', lesson.description) ?? lesson.description;
    this.api.updateSession(lesson.id, { title, description }).subscribe({ next: () => this.load() });
  }
  deleteSession(lesson: TeacherSession): void { if (confirm(`حذف "${lesson.title}" ومحتواه؟`)) this.api.deleteSession(lesson.id).subscribe({ next: () => this.load() }); }
  addContent(lesson: TeacherSession): void {
    const value = this.contentForm.getRawValue(); const type = value.type;
    if (!value.title || (type === 'video' && !value.url)) {
      this.error = 'العنوان ورابط الفيديو مطلوبان';
      return;
    }
    if (type !== 'video' && (!value.dateOfDelivery || value.maxGrade < 1)) {
      this.error = 'الدرجة وموعد التسليم مطلوبان';
      return;
    }
    let questions: TeacherContent['questions'];
    if (type === 'test') {
      try {
        questions = JSON.parse(value.questionsJson || '[]') as TeacherContent['questions'];
        if (!Array.isArray(questions) || questions.length === 0) throw new Error();
      } catch {
        this.error = 'أدخل سؤالاً واحداً على الأقل بصيغة JSON صحيحة';
        return;
      }
    }
    const input = type === 'video'
      ? { sessionId: lesson.id, title: value.title, url: value.url, position: this.contentCount(lesson) }
      : { sessionId: lesson.id, title: value.title, maxGrade: value.maxGrade, dateOfDelivery: new Date(value.dateOfDelivery).toISOString(), instructions: value.instructions, position: this.contentCount(lesson), ...(type === 'test' ? { questions } : {}) };
    this.api.createContent(type, input).subscribe({ next: () => { this.contentForm.reset({ type: 'video', maxGrade: 10 }); this.load(); }, error: error => this.error = error.error?.message ?? 'راجع بيانات المحتوى' });
  }
  editContent(type: ContentType, item: TeacherContent): void {
    const title = prompt('العنوان', item.title); if (!title) return;
    const input: Partial<TeacherContent> = { title };
    if (type === 'video') { const url = prompt('رابط الفيديو (HTTP/HTTPS)', item.url); if (!url) return; input.url = url; }
    else {
      const maxGrade = Number(prompt('الدرجة القصوى', String(item.maxGrade ?? 10)));
      if (!Number.isFinite(maxGrade) || maxGrade < 1) return;
      input.maxGrade = maxGrade;
      input.instructions = prompt('التعليمات', item.instructions ?? '') ?? item.instructions;
    }
    this.api.updateContent(type, item.id, input).subscribe({ next: () => this.load(), error: () => this.error = 'تعذر تعديل المحتوى' });
  }
  deleteContent(type: ContentType, item: TeacherContent): void { if (confirm(`حذف "${item.title}"؟`)) this.api.deleteContent(type, item.id).subscribe({ next: () => this.load() }); }
  togglePublish(): void { if (!this.course) return; this.api.setPublished(this.id, this.course.status !== 'published').subscribe({ next: () => this.load(), error: error => this.error = error.error?.message ?? 'تعذر تغيير حالة النشر' }); }
  contentCount(lesson: TeacherSession): number { return lesson.videos.length + lesson.homeworks.length + lesson.tests.length; }
  allContent(lesson: TeacherSession): Array<{ type: ContentType; content: TeacherContent }> {
    return [...lesson.videos.map(content => ({ type: 'video' as const, content })), ...lesson.homeworks.map(content => ({ type: 'homework' as const, content })), ...lesson.tests.map(content => ({ type: 'test' as const, content }))].sort((a, b) => a.content.position - b.content.position);
  }
  label(type: ContentType): string { return type === 'video' ? 'فيديو' : type === 'homework' ? 'واجب' : 'اختبار'; }
}
