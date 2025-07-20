import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentForumComponent } from './student-forum.component';

describe('StudentForumComponent', () => {
  let component: StudentForumComponent;
  let fixture: ComponentFixture<StudentForumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentForumComponent]
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
