import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MyCoursesComponent } from './my-courses.component';
import { CourseService } from '../../../shared/services/course.service';

describe('MyCoursesComponent', () => {
  let component: MyCoursesComponent;
  let fixture: ComponentFixture<MyCoursesComponent>;
  const courseService = {
    getAvailableCourses: jasmine.createSpy().and.returnValue(of({
      success: true,
      data: { items: [], totalRecords: 0, page: 1, pageSize: 50 },
    })),
    getMyCourses: jasmine.createSpy().and.returnValue(of({
      success: true,
      data: [],
    })),
    enrollInCourse: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCoursesComponent],
      providers: [
        provideRouter([]),
        { provide: CourseService, useValue: courseService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads catalog and enrolled courses from the API', () => {
    expect(courseService.getAvailableCourses).toHaveBeenCalledWith(1, 50);
    expect(courseService.getMyCourses).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });
});
