import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { Course, CourseProgress, Lesson } from '../../../shared/models/course.model';
import { CourseService } from '../../../shared/services/course.service';
import { AuthService } from '../../../shared/services/auth.service';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { PageIntroComponent } from '../../../shared/components/page-intro/page-intro.component';
import { mediaUrl } from '../../../shared/utils/media-url';

@Component({
  selector: 'app-courses-content',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent, PageIntroComponent],
  templateUrl: './courses-content.component.html',
  styleUrl: './courses-content.component.scss'
})
export class CoursesContentComponent implements OnInit, OnDestroy {
  @ViewChild('courseVideo') courseVideo?: ElementRef<HTMLVideoElement>;

  courseId = 0;
  course: Course | null = null;
  lessons: Lesson[] = [];
  activeLesson: Lesson | null = null;
  progress: CourseProgress | null = null;
  isLoading = true;
  isSaving = false;
  isEnrolling = false;
  errorMessage = '';
  openMaterial: {
    id: number;
    title: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  } | null = null;
  materialWidth = 40;
  previewEmbedUrl: SafeResourceUrl | null = null;
  embedUrl: SafeResourceUrl | null = null;
  embedLoading = false;
  private lastPersistedSecond = 0;
  private readonly destroy$ = new Subject<void>();
  readonly mediaUrl = mediaUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private auth: AuthService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.courseId) || this.courseId <= 0) {
      this.errorMessage = 'رابط الكورس غير صحيح.';
      this.isLoading = false;
      return;
    }
    this.loadWorkspace();
  }

  ngOnDestroy(): void {
    this.persistCurrentPosition();
    this.destroy$.next();
    this.destroy$.complete();
  }

  get lockedLessonIndexes(): number[] {
    const count = this.course?.lessonsCount ?? 0;
    return Array.from({ length: count }, (_, index) => index + 1);
  }

  enrollCtaLabel(): string {
    if (this.isEnrolling) return 'جارٍ إتمام العملية...';
    if (!this.auth.isAuthenticated) return 'سجّل ثم اشترك';
    if (!this.course) return 'التسجيل';
    return this.course.price === 0 ? 'التسجيل مجاناً' : 'شراء والتسجيل';
  }

  get videoFlex(): string {
    return this.openMaterial ? `${100 - this.materialWidth} 1 0` : '1 1 auto';
  }

  get materialFlex(): string {
    return `${this.materialWidth} 1 0`;
  }

  limitPreview(event: Event): void {
    const video = event.target as HTMLVideoElement;
    const max = this.course?.previewVideo?.previewMaxSeconds ?? 900;
    if (video.currentTime > max) {
      video.currentTime = max;
      video.pause();
    }
  }

  outlineLabel(kind: string): string {
    if (kind === 'homework_solution') return 'جزء حل';
    if (kind === 'practice') return 'تدريب على';
    return 'درس';
  }

  isPdf(material: { mimeType: string; url: string }): boolean {
    return material.mimeType.includes('pdf') || material.url.toLowerCase().endsWith('.pdf');
  }

  isImage(material: { mimeType: string }): boolean {
    return material.mimeType.startsWith('image/');
  }

  safeMaterialUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.mediaUrl(url));
  }

  openBeside(material: NonNullable<Lesson['materials']>[number]): void {
    this.openMaterial = material;
  }

  resizeMaterial(delta: number): void {
    this.materialWidth = Math.min(70, Math.max(25, this.materialWidth + delta));
  }

  enroll(): void {
    if (!this.auth.isAuthenticated) {
      void this.router.navigate(['/auth/sign-up'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    if (!this.course || this.course.isEnrolled || this.isEnrolling) return;
    this.isEnrolling = true;
    this.errorMessage = '';
    this.courseService.enrollInCourse(this.courseId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        if (!response.success) {
          this.errorMessage = response.message || 'تعذر إتمام التسجيل في الكورس.';
          this.isEnrolling = false;
          return;
        }
        this.isEnrolling = false;
        this.loadWorkspace();
      },
      error: error => {
        this.errorMessage = error.error?.message ?? 'تعذر إتمام التسجيل في الكورس.';
        this.isEnrolling = false;
      },
    });
  }

  loadWorkspace(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.lessons = [];
    this.activeLesson = null;
    this.progress = null;
    this.courseService.getCourse(this.courseId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        if (!response.success) {
          this.errorMessage = 'تعذر تحميل الكورس.';
          this.isLoading = false;
          return;
        }
        this.course = response.data;
        if (!this.course.isEnrolled) {
          this.isLoading = false;
          this.resolvePreviewVideo();
          return;
        }
        this.loadEnrolledContent();
      },
      error: () => {
        this.errorMessage = 'تعذر الاتصال بالخادم. حاول مرة أخرى.';
        this.isLoading = false;
      },
    });
  }

  private loadEnrolledContent(): void {
    forkJoin({
      lessons: this.courseService.getCourseCurriculum(this.courseId),
      progress: this.courseService.getCourseProgress(this.courseId),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (!result.lessons.success || !result.progress.success) {
          this.errorMessage = 'تعذر تحميل محتوى الكورس.';
          this.isLoading = false;
          return;
        }
        this.lessons = result.lessons.data;
        this.progress = result.progress.data;
        const resumeLesson = this.lessons.find(
          lesson => lesson.id === this.progress?.lastWatchedLessonId
        );
        this.selectLesson(resumeLesson ?? this.lessons[0] ?? null, false);
      },
      error: error => {
        this.errorMessage = error.status === 403
          ? 'يجب التسجيل في الكورس للوصول إلى المحتوى.'
          : 'تعذر الاتصال بالخادم. حاول مرة أخرى.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  selectLesson(lesson: Lesson | null, persistPrevious = true): void {
    if (persistPrevious) this.persistCurrentPosition();
    this.activeLesson = lesson;
    this.lastPersistedSecond = lesson?.lastPositionSeconds ?? 0;
    this.resolveActiveVideo();
  }

  /**
   * Bunny-hosted videos have no stored URL: a fresh, short-lived signed
   * embed link must be requested at watch-time (enrollment-checked
   * server-side), instead of the raw <video src> used for legacy links.
   */
  private resolveActiveVideo(): void {
    this.embedUrl = null;
    this.embedLoading = false;
    const video = this.activeLesson?.videos?.[0];
    if (!video || video.provider !== 'bunny-stream') return;
    this.embedLoading = true;
    this.courseService.getVideoPlaybackUrl(video.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.embedLoading = false;
        if (response.success) {
          this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.data.url);
        }
      },
      error: () => {
        this.embedLoading = false;
        this.errorMessage = 'تعذر تحميل الفيديو.';
      },
    });
  }

  private resolvePreviewVideo(): void {
    this.previewEmbedUrl = null;
    const preview = this.course?.previewVideo;
    if (!preview || preview.provider !== 'bunny-stream') return;
    this.courseService.getVideoPlaybackUrl(preview.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        if (response.success) {
          this.previewEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.data.url);
        }
      },
    });
  }

  onVideoLoaded(video: HTMLVideoElement): void {
    const resumeAt = this.activeLesson?.lastPositionSeconds ?? 0;
    if (resumeAt > 0 && resumeAt < video.duration) {
      video.currentTime = resumeAt;
    }
  }

  onTimeUpdate(video: HTMLVideoElement): void {
    const currentSecond = Math.floor(video.currentTime);
    if (currentSecond - this.lastPersistedSecond >= 10) {
      this.saveProgress(currentSecond);
    }
  }

  persistCurrentPosition(): void {
    const video = this.courseVideo?.nativeElement;
    if (video && this.activeLesson) {
      this.saveProgress(Math.floor(video.currentTime));
    }
  }

  saveProgress(positionSeconds: number): void {
    if (!this.activeLesson || this.isSaving) return;
    this.isSaving = true;
    const watched = Math.max(this.activeLesson.watchTimeSeconds, positionSeconds);
    this.courseService.updateLessonProgress(
      this.courseId,
      this.activeLesson.id,
      watched,
      positionSeconds,
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        if (response.success && this.activeLesson) {
          this.activeLesson.watchTimeSeconds = response.data.watchTimeSeconds;
          this.activeLesson.lastPositionSeconds = response.data.lastPositionSeconds;
          this.lastPersistedSecond = response.data.lastPositionSeconds;
        }
      },
      error: () => {
        this.errorMessage = 'تعذر حفظ موضع المشاهدة.';
        this.isSaving = false;
      },
      complete: () => {
        this.isSaving = false;
      },
    });
  }

  completeActiveLesson(): void {
    if (!this.activeLesson || this.activeLesson.completed) return;
    this.courseService.markLessonCompleted(this.courseId, this.activeLesson.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if (!response.success || !this.activeLesson) return;
          this.activeLesson.completed = true;
          if (this.progress) {
            this.progress.completedLessons = [
              ...new Set([...this.progress.completedLessons, this.activeLesson.id])
            ];
            this.progress.progressPercentage = this.lessons.length
              ? Math.round((this.progress.completedLessons.length / this.lessons.length) * 100)
              : 0;
          }
        },
        error: () => {
          this.errorMessage = 'تعذر تسجيل اكتمال الدرس.';
        },
      });
  }
}
