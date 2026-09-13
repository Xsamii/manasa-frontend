import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AccountSettingsComponent } from './account-settings.component';
import { AuthService } from '../../shared/services/auth.service';
import { UserRole } from '../../shared/models/user.model';

describe('AccountSettingsComponent', () => {
  const auth = {
    currentUser: {
      id: 5,
      fullName: 'سارة علي',
      email: 'sara.student@manasa.test',
      phoneNumber: '01055556666',
      role: UserRole.STUDENT,
      schoolName: 'مدرسة النور',
      studyYear: '1st Secondary',
    },
    getProfile: jasmine.createSpy().and.returnValue(of({ success: true, data: { user: {} } })),
    updateProfile: jasmine.createSpy(),
    changePassword: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSettingsComponent],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compileComponents();
  });

  it('loads the signed-in user into the profile form', () => {
    const fixture: ComponentFixture<AccountSettingsComponent> =
      TestBed.createComponent(AccountSettingsComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.profileForm.value.fullName).toBe('سارة علي');
    expect(fixture.nativeElement.textContent).toContain('سارة علي');
  });
});
