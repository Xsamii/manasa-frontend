import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStatusComponent } from './sign-up-status.component';

describe('SignUpStatusComponent', () => {
  let component: SignUpStatusComponent;
  let fixture: ComponentFixture<SignUpStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
