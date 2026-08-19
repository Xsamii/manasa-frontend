import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninStatusComponent } from './signin-status.component';
import { provideRouter } from '@angular/router';

describe('SigninStatusComponent', () => {
  let component: SigninStatusComponent;
  let fixture: ComponentFixture<SigninStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninStatusComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
