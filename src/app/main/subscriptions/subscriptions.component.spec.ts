import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsComponent } from './subscriptions.component';
import { WalletService } from '../../shared/services/wallet.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('SubscriptionsComponent', () => {
  let component: SubscriptionsComponent;
  let fixture: ComponentFixture<SubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionsComponent],
      providers: [provideRouter([]), {
        provide: WalletService,
        useValue: {
          getSubscriptions: jasmine.createSpy().and.returnValue(of({
            success: true,
            data: [],
          })),
        },
      }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
