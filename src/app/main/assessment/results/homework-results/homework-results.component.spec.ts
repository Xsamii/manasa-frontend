import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkResultsComponent } from './homework-results.component';

describe('HomeworkResultsComponent', () => {
  let component: HomeworkResultsComponent;
  let fixture: ComponentFixture<HomeworkResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeworkResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
