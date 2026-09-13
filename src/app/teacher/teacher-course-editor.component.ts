import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Upload as TusUpload } from 'tus-js-client';
import {
  ContentType,
  RosterStudent,
  TeacherContent,
  TeacherCourse,
  TeacherSession,
} from './teacher-authoring.model';
import { TeacherAuthoringService } from './teacher-authoring.service';
import { STUDY_YEAR_OPTIONS } from '../shared/models/study-year';
import { StudyYearPipe } from '../shared/pipes/study-year.pipe';
import { PageIntroComponent } from '../shared/components/page-intro/page-intro.component';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StudyYearPipe, PageIntroComponent],
  template: `
    <p *ngIf="error" class="bg-red-50 text-red-700 p-3 rounded mb-4">{{ error }}</p>
    <ng-container *ngIf="course">
      <header class="flex flex-wrap items-center gap-3 mb-6">
        <div class="ml-auto"><h1 class="text-3xl font-bold">{{ course.title }}</h1>
          <p class="text-slate-500">{{ course.studyYear | studyYear }} · {{ course.status === 'published' ? 'منشور' : 'مسودة' }}</p></div>
        <button class="secondary" (click)="preview = !preview">{{ preview ? 'إنهاء المعاينة' : 'معاينة' }}</button>
        <button class="btn" (click)="togglePublish()">{{ course.status === 'published' ? 'إرجاع لمسودة' : 'نشر الكورس' }}</button>
      </header>
      <app-page-intro
        text="حرّر بيانات الكورس، أضف جلسات بالترتيب، ثم ارفع فيديو وواجباً واختباراً لكل جلسة. المعاينة تعرض ما سيراه الطالب المشترك. النشر يظهر الكورس في كتالوج الصف.">
      </app-page-intro>

      <section *ngIf="preview" class="card mb-6">
        <h2 class="text-2xl font-bold">{{ course.title }}</h2>
        <p class="text-sm text-slate-500">{{ course.studyYear | studyYear }}</p>
        <p class="my-2">{{ course.description }}</p>
        <ol class="list-decimal pr-6"><li *ngFor="let lesson of course.sessions">{{ lesson.title }} — {{ contentCount(lesson) }} عناصر</li></ol>
      </section>

      <div class="grid lg:grid-cols-[1fr_2fr] gap-6">
        <aside class="space-y-6">
          <form class="card space-y-3" [formGroup]="metadataForm" (ngSubmit)="saveMetadata()">
            <h2 class="font-bold text-lg">بيانات الكورس</h2>
            <input class="field" formControlName="title"><textarea class="field" formControlName="description"></textarea>
            <select class="field" formControlName="studyYear"><option *ngFor="let year of years" [value]="year.value">{{ year.label }}</option></select>
            <input class="field" type="number" min="0" step="0.01" formControlName="price" placeholder="السعر">
            <select class="field" formControlName="currency"><option value="EGP">EGP</option></select>
            <button class="btn w-full" [disabled]="metadataForm.invalid">حفظ</button>
          </form>
          <section class="card">
            <h2 class="font-bold text-lg mb-3">الطلاب المسجلون ({{ roster.length }})</h2>
            <p *ngIf="!roster.length" class="text-slate-500">لا يوجد طلاب مسجلون حتى الآن.</p>
            <div *ngFor="let student of roster" class="border-t py-2"><b>{{ student.fullName }}</b><small class="block">{{ student.email }} · {{ student.studyYear | studyYear }}</small></div>
          </section>
        </aside>

        <main>
          <form class="card flex flex-col md:flex-row gap-3 mb-4" [formGroup]="sessionForm" (ngSubmit)="addSession()">
            <input class="field" formControlName="title" placeholder="عنوان الجلسة / المحاضرة">
            <input class="field" formControlName="description" placeholder="وصف الجلسة">
            <input class="field" formControlName="outlineLesson" placeholder="درس كذا">
            <input class="field" formControlName="outlineSolution" placeholder="جزء حل كذا">
            <input class="field" formControlName="outlinePractice" placeholder="تدريب على كذا">
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
                <small>
                  {{ label(item.type) }}
                  <span *ngIf="item.type === 'video' && item.content.status === 'processing'" class="text-amber-600">(قيد المعالجة...)</span>
                  <span *ngIf="item.type === 'video' && item.content.status === 'error'" class="text-red-600">(فشل الرفع)</span>
                </small>
                <b class="block">{{ item.content.title }}</b>
                <button class="link" (click)="editContent(item.type, item.content)">تعديل</button>
                <button class="danger" (click)="deleteContent(item.type, item.content)">حذف</button>
              </div>
            </div>
            <form [formGroup]="contentForm" (ngSubmit)="addContent(lesson)" class="bg-slate-50 rounded-lg p-3 grid md:grid-cols-2 gap-3">
              <select class="field" formControlName="type"><option value="video">فيديو</option><option value="homework">واجب</option><option value="test">اختبار</option></select>
              <input class="field" formControlName="title" placeholder="العنوان">
              <ng-container *ngIf="contentForm.controls.type.value === 'video'">
                <label class="md:col-span-2 text-sm flex items-center gap-2">
                  <input type="checkbox" formControlName="isPreview"> فيديو معاينة مجاني 10–20 دقيقة
                </label>
                <input
                  class="field md:col-span-2"
                  type="file"
                  accept="video/*"
                  [disabled]="uploadingLessonId === lesson.id"
                  (change)="startVideoUpload(lesson, $event)">
                <div *ngIf="uploadingLessonId === lesson.id" class="md:col-span-2 text-sm space-y-1">
                  <div class="upload-track"><div class="upload-fill" [style.width.%]="uploadProgress"></div></div>
                  <span>{{ uploadStatusLabel }}</span>
                </div>
              </ng-container>
              <ng-container *ngIf="contentForm.controls.type.value !== 'video'">
                <input class="field" type="number" min="1" formControlName="maxGrade" placeholder="الدرجة القصوى">
                <input class="field" type="datetime-local" formControlName="dateOfDelivery">
                <textarea class="field md:col-span-2" formControlName="instructions" placeholder="التعليمات"></textarea>
                <textarea *ngIf="contentForm.controls.type.value === 'test'" class="field md:col-span-2" rows="6"
                  formControlName="questionsJson"
                  placeholder='الأسئلة بصيغة JSON: [{"prompt":"2+2؟","points":1,"options":[{"text":"4","isCorrect":true},{"text":"3","isCorrect":false}]}]'></textarea>
                <button class="btn md:col-span-2">إضافة المحتوى</button>
              </ng-container>
            </form>
            <div class="mt-3">
              <h4 class="font-semibold mb-2">ماتريال المحاضرة (PDF وغيره)</h4>
              <input type="file" (change)="uploadMaterial(lesson, $event)">
              <div *ngFor="let material of lesson.materials" class="text-sm flex justify-between border-t py-2">
                <span>{{ material.title }}</span>
                <button class="danger" (click)="removeMaterial(material.id)">حذف</button>
              </div>
            </div>
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
    .upload-track{background:#e2e8f0;border-radius:999px;height:.5rem;overflow:hidden}
    .upload-fill{background:#ea580c;height:100%;transition:width .2s ease}
  `],
})
export class TeacherCourseEditorComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(TeacherAuthoringService);
  course?: TeacherCourse;
  roster: RosterStudent[] = [];
  error = '';
  preview = false;
  readonly years = STUDY_YEAR_OPTIONS;
  metadataForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    studyYear: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    currency: ['EGP', Validators.required],
  });
  sessionForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    outlineLesson: [''],
    outlineSolution: [''],
    outlinePractice: [''],
  });
  contentForm = this.fb.nonNullable.group({
    type: ['video' as ContentType, Validators.required], title: ['', Validators.required],
    url: [''], maxGrade: [10], dateOfDelivery: [''], instructions: [''], questionsJson: [''],
    isPreview: [false],
  });
  private readonly id = Number(this.route.snapshot.paramMap.get('id'));
  uploadingLessonId: number | null = null;
  uploadProgress = 0;
  uploadStatusLabel = '';
  private statusPollTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void { this.load(); }
  ngOnDestroy(): void { if (this.statusPollTimer) clearTimeout(this.statusPollTimer); }
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
  addSession(): void {
    if (this.sessionForm.invalid) return;
    const value = this.sessionForm.getRawValue();
    const outline = [
      value.outlineLesson ? { kind: 'lesson' as const, title: value.outlineLesson } : null,
      value.outlineSolution ? { kind: 'homework_solution' as const, title: value.outlineSolution } : null,
      value.outlinePractice ? { kind: 'practice' as const, title: value.outlinePractice } : null,
    ].filter((item): item is { kind: 'lesson' | 'homework_solution' | 'practice'; title: string } => !!item);
    this.api.createSession(this.id, {
      title: value.title,
      description: value.description,
      outline,
      position: this.course?.sessions?.length ?? 0,
    }).subscribe({ next: () => { this.sessionForm.reset(); this.load(); }, error: () => this.error = 'تعذر إضافة الجلسة' });
  }
  editSession(lesson: TeacherSession): void {
    const title = prompt('عنوان الجلسة', lesson.title); if (!title) return;
    const description = prompt('وصف الجلسة', lesson.description) ?? lesson.description;
    this.api.updateSession(lesson.id, { title, description }).subscribe({ next: () => this.load() });
  }
  deleteSession(lesson: TeacherSession): void { if (confirm(`حذف "${lesson.title}" ومحتواه؟`)) this.api.deleteSession(lesson.id).subscribe({ next: () => this.load() }); }
  addContent(lesson: TeacherSession): void {
    const value = this.contentForm.getRawValue(); const type = value.type;
    if (type === 'video') return; // videos are added via startVideoUpload on file selection
    if (!value.title) {
      this.error = 'العنوان مطلوب';
      return;
    }
    if (!value.dateOfDelivery || value.maxGrade < 1) {
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
    const input = { sessionId: lesson.id, title: value.title, maxGrade: value.maxGrade, dateOfDelivery: new Date(value.dateOfDelivery).toISOString(), instructions: value.instructions, position: this.contentCount(lesson), ...(type === 'test' ? { questions } : {}) };
    this.api.createContent(type, input).subscribe({ next: () => { this.contentForm.reset({ type: 'video', maxGrade: 10, isPreview: false }); this.load(); }, error: error => this.error = error.error?.message ?? 'راجع بيانات المحتوى' });
  }
  startVideoUpload(lesson: TeacherSession, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const value = this.contentForm.getRawValue();
    const title = value.title || file.name;
    const isPreview = value.isPreview;
    this.error = '';
    this.uploadingLessonId = lesson.id;
    this.uploadProgress = 0;
    this.uploadStatusLabel = 'جارٍ التحضير...';
    this.api.createVideoUpload({
      sessionId: lesson.id,
      title,
      isPreview,
      previewMaxSeconds: isPreview ? 900 : undefined,
      position: this.contentCount(lesson),
    }).subscribe({
      next: response => {
        const body = response.data;
        if (!body) { this.failUpload('تعذر بدء الرفع'); return; }
        const { video, upload } = body;
        this.uploadStatusLabel = 'جارٍ الرفع...';
        const tusUpload = new TusUpload(file, {
          endpoint: upload.endpoint,
          headers: {
            AuthorizationSignature: upload.signature,
            AuthorizationExpire: String(upload.expire),
            VideoId: upload.videoId,
            LibraryId: upload.libraryId,
          },
          metadata: { filetype: file.type, title },
          chunkSize: 50 * 1024 * 1024,
          onError: uploadError => this.failUpload('تعذر رفع الفيديو: ' + uploadError.message),
          onProgress: (bytesUploaded, bytesTotal) => {
            this.uploadProgress = Math.round((bytesUploaded / bytesTotal) * 100);
          },
          onSuccess: () => {
            this.uploadStatusLabel = 'جارٍ معالجة الفيديو...';
            this.pollVideoStatus(video.id, lesson);
          },
        });
        tusUpload.start();
      },
      error: uploadError => this.failUpload(uploadError.error?.message ?? 'تعذر بدء الرفع'),
    });
    input.value = '';
  }
  private pollVideoStatus(videoId: number, lesson: TeacherSession, attempt = 0): void {
    if (attempt > 60) { this.finishUpload(); return; }
    this.api.getVideoStatus(videoId).subscribe({
      next: response => {
        if (response.data?.status === 'processing') {
          this.statusPollTimer = setTimeout(() => this.pollVideoStatus(videoId, lesson, attempt + 1), 5000);
        } else {
          this.finishUpload();
        }
      },
      error: () => this.finishUpload(),
    });
  }
  private finishUpload(): void {
    this.uploadingLessonId = null;
    this.uploadProgress = 0;
    this.uploadStatusLabel = '';
    this.contentForm.reset({ type: 'video', maxGrade: 10, isPreview: false });
    this.load();
  }
  private failUpload(message: string): void {
    this.error = message;
    this.uploadingLessonId = null;
    this.uploadProgress = 0;
    this.uploadStatusLabel = '';
  }
  uploadMaterial(lesson: TeacherSession, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.api.addMaterial(lesson.id, file, file.name).subscribe({ next: () => this.load(), error: () => this.error = 'تعذر رفع الماتريال' });
  }
  removeMaterial(id: number): void {
    this.api.deleteMaterial(id).subscribe({ next: () => this.load() });
  }
  editContent(type: ContentType, item: TeacherContent): void {
    const title = prompt('العنوان', item.title); if (!title) return;
    const input: Partial<TeacherContent> = { title };
    if (type !== 'video') {
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
