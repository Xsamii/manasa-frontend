import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        provideHttpClient(),
        provideRouter([{ path: '', component: LandingComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
  });

  it('explains the study years and offers a sign-in section', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('الصفوف الدراسية');
    expect(text).toContain('الصف الأول الإعدادي');
    expect(text).toContain('سجّل دخولك للبدء');
    expect(fixture.nativeElement.querySelector('app-sign-in-form')).toBeTruthy();
  });
});
