import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseHistoryComponent } from './purchase-history.component';
import { WalletService } from '../../shared/services/wallet.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('PurchaseHistoryComponent', () => {
  let component: PurchaseHistoryComponent;
  let fixture: ComponentFixture<PurchaseHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseHistoryComponent],
      providers: [provideRouter([]), {
        provide: WalletService,
        useValue: {
          getPurchaseHistory: jasmine.createSpy().and.returnValue(of({
            success: true,
            data: [],
          })),
          getReceipt: jasmine.createSpy(),
        },
      }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
