import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesStatisticsComponent } from './courses-statistics.component';

describe('CoursesStatisticsComponent', () => {
  let component: CoursesStatisticsComponent;
  let fixture: ComponentFixture<CoursesStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
