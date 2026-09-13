import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StudentForumComponent } from './student-forum.component';
import { CourseService } from '../../shared/services/course.service';
import { AuthService } from '../../shared/services/auth.service';
import { UserRole } from '../../shared/models/user.model';

describe('StudentForumComponent', () => {
  let component: StudentForumComponent;
  let fixture: ComponentFixture<StudentForumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentForumComponent]
      ,providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } } },
        },
        {
          provide: AuthService,
          useValue: { currentUser: { role: UserRole.STUDENT } },
        },
        {
          provide: CourseService,
          useValue: {
            getMyCourses: () => of({
              success: true,
              data: [],
              message: 'ok',
              timestamp: '',
              path: '',
            }),
          },
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
