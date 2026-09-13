import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CoursesContentComponent } from './courses-content.component';
import { CourseService } from '../../../shared/services/course.service';
import { AuthService } from '../../../shared/services/auth.service';

describe('CoursesContentComponent', () => {
  let component: CoursesContentComponent;
  let fixture: ComponentFixture<CoursesContentComponent>;
  const courseService = {
    getCourse: jasmine.createSpy().and.returnValue(of({
      success: true,
      data: { id: 3, title: 'Course', isEnrolled: true, lessonsCount: 1 },
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
    enrollInCourse: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesContentComponent],
      providers: [
        provideRouter([]),
        { provide: CourseService, useValue: courseService },
        { provide: AuthService, useValue: { isAuthenticated: true, currentUser: null } },
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

describe('CoursesContentComponent locked preview', () => {
  let component: CoursesContentComponent;
  const courseService = {
    getCourse: jasmine.createSpy().and.returnValue(of({
      success: true,
      data: {
        id: 3,
        title: 'Course',
        description: 'Public summary',
        isEnrolled: false,
        lessonsCount: 2,
        price: 50,
        currency: 'EGP',
      },
    })),
    getCourseCurriculum: jasmine.createSpy(),
    getCourseProgress: jasmine.createSpy(),
    enrollInCourse: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesContentComponent],
      providers: [
        provideRouter([]),
        { provide: CourseService, useValue: courseService },
        { provide: AuthService, useValue: { isAuthenticated: true, currentUser: null } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '3' } } },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CoursesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not load videos or curriculum before enrollment', () => {
    expect(component.course?.isEnrolled).toBeFalse();
    expect(component.lessons.length).toBe(0);
    expect(component.activeLesson).toBeNull();
    expect(courseService.getCourseCurriculum).not.toHaveBeenCalled();
    expect(courseService.getCourseProgress).not.toHaveBeenCalled();
  });
});
