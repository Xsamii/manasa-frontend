import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { Course, CourseProgress, Lesson } from '../../../shared/models/course.model';
import { CourseService } from '../../../shared/services/course.service';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-courses-content',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
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
  errorMessage = '';
  private lastPersistedSecond = 0;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
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

  loadWorkspace(): void {
    this.isLoading = true;
    this.errorMessage = '';
    forkJoin({
      course: this.courseService.getCourse(this.courseId),
      lessons: this.courseService.getCourseCurriculum(this.courseId),
      progress: this.courseService.getCourseProgress(this.courseId),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (!result.course.success || !result.lessons.success || !result.progress.success) {
          this.errorMessage = 'تعذر تحميل محتوى الكورس.';
          return;
        }
        this.course = result.course.data;
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
