import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeRechargeComponent } from './code-recharge.component';
import { WalletService } from '../../shared/services/wallet.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('CodeRechargeComponent', () => {
  let component: CodeRechargeComponent;
  let fixture: ComponentFixture<CodeRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeRechargeComponent]
      ,providers: [provideRouter([]), {
        provide: WalletService,
        useValue: {
          chargeWithCode: jasmine.createSpy().and.returnValue(of({
            success: true,
            data: { balance: 50, currency: 'EGP' },
          })),
        },
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submits a recharge code and shows the server balance', () => {
    component.rechargeForm.setValue({ rechargeCode: 'ABC-123' });
    component.onSubmit();
    expect(component.successMessage).toContain('50 EGP');
  });
});
