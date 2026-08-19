import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWalletComponent } from './my-wallet.component';
import { WalletService } from '../../shared/services/wallet.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('MyWalletComponent', () => {
  let component: MyWalletComponent;
  let fixture: ComponentFixture<MyWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyWalletComponent]
      ,providers: [provideRouter([]), {
        provide: WalletService,
        useValue: {
          getBalance: jasmine.createSpy().and.returnValue(of({
            success: true,
            data: { balance: 125, currency: 'EGP' },
          })),
          getTransactions: jasmine.createSpy().and.returnValue(of({
            success: true,
            data: { items: [], totalRecords: 0, page: 1, pageSize: 20 },
          })),
        },
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.balance).toBe(125);
  });
});
