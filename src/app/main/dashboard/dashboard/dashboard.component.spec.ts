import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { CourseService } from '../../../shared/services/course.service';
import { NotificationService } from '../../../shared/services/notification.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: CourseService,
          useValue: {
            getMyCourses: () => of({ success: true, data: [] }),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            unreadCount: () => of({ success: true, data: { count: 0 } }),
            list: () => of({
              success: true,
              data: { items: [], totalRecords: 0, page: 1, pageSize: 3 },
            }),
            markRead: () => of({ success: true, data: {} }),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
