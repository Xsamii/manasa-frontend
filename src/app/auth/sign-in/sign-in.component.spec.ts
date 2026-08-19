import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { SignInComponent } from './sign-in.component';
import { UserRole } from '../../shared/models/user.model';

describe('SignInComponent', () => {
  let component: SignInComponent;
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the student sign-in copy by default', () => {
    expect(component.isTeacher).toBeFalse();
    expect(component.demoAccount.email).toContain('sara.student');
  });
});
