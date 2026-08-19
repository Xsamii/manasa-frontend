import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpStatusComponent } from './sign-up-status.component';
import { provideRouter } from '@angular/router';

describe('SignUpStatusComponent', () => {
  let component: SignUpStatusComponent;
  let fixture: ComponentFixture<SignUpStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpStatusComponent],
      providers: [provideRouter([])],
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
