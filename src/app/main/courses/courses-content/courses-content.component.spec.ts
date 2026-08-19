import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CoursesContentComponent } from './courses-content.component';
import { CourseService } from '../../../shared/services/course.service';

describe('CoursesContentComponent', () => {
  let component: CoursesContentComponent;
  let fixture: ComponentFixture<CoursesContentComponent>;
  const courseService = {
    getCourse: jasmine.createSpy().and.returnValue(of({
      success: true,
      data: { id: 3, title: 'Course' },
    })),
    getCourseCurriculum: jasmine.createSpy().and.returnValue(of({
      success: true,
      data: [{
        id: 8,
        courseId: 3,
        title: 'Lesson',
        description: '',
        videoUrl: 'https://example.com/video.mp4',
        order: 1,
        videos: [],
        resources: [],
        completed: false,
        watchTimeSeconds: 30,
        lastPositionSeconds: 20,
      }],
    })),
    getCourseProgress: jasmine.createSpy().and.returnValue(of({
      success: true,
      data: {
        courseId: 3,
        completedLessons: [],
        lastWatchedLessonId: 8,
        lastPositionSeconds: 20,
        totalWatchTimeSeconds: 30,
        progressPercentage: 0,
        updatedAt: null,
      },
    })),
    updateLessonProgress: jasmine.createSpy().and.returnValue(of({
      success: true,
      data: {
        watchTimeSeconds: 40,
        lastPositionSeconds: 25,
      },
    })),
    markLessonCompleted: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesContentComponent],
      providers: [
        { provide: CourseService, useValue: courseService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '3' } } },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('resumes the last watched lesson', () => {
    expect(component.activeLesson?.id).toBe(8);
    expect(component.activeLesson?.lastPositionSeconds).toBeGreaterThan(0);
  });
});
