import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { SignInComponent } from './sign-in.component';
import { SignInFormComponent } from '../../shared/components/sign-in-form/sign-in-form.component';
import { UserRole } from '../../shared/models/user.model';
import { By } from '@angular/platform-browser';

describe('SignInComponent', () => {
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        provideHttpClient(),
        provideRouter([
          { path: '', component: SignInComponent, data: { role: UserRole.STUDENT } },
        ]),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('uses the student sign-in copy by default', () => {
    const form = fixture.debugElement.query(By.directive(SignInFormComponent)).componentInstance as SignInFormComponent;
    expect(form.isTeacher).toBeFalse();
    expect(form.demoAccount.email).toContain('sara.student');
  });
});
