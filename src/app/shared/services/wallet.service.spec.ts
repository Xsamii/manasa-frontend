import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WalletService } from './wallet.service';
import { apiUrl } from '../../core/config/api.config';

describe('WalletService', () => {
  let service: WalletService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WalletService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends the code and idempotency key, never a browser balance', () => {
    service.chargeWithCode('ABC-123', 'stable-key').subscribe();

    const request = http.expectOne(apiUrl('wallet/charge-code'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ code: 'ABC-123' });
    expect(request.request.headers.get('x-idempotency-key')).toBe('stable-key');
    request.flush({
      success: true,
      data: { balance: 50, currency: 'EGP' },
    });

    const balanceRefresh = http.expectOne(apiUrl('wallet/balance'));
    balanceRefresh.flush({
      success: true,
      data: { balance: 50, currency: 'EGP' },
    });
  });

  it('uses real transaction, purchase, and subscription endpoints', () => {
    service.getTransactions().subscribe();
    const transactions = http.expectOne(apiUrl('wallet/transactions'));
    expect(transactions.request.method).toBe('GET');
    transactions.flush({ success: true, data: { items: [] } });

    service.getPurchaseHistory().subscribe();
    const purchases = http.expectOne(apiUrl('wallet/purchases'));
    expect(purchases.request.method).toBe('GET');
    purchases.flush({ success: true, data: [] });

    service.getSubscriptions().subscribe();
    const subscriptions = http.expectOne(apiUrl('wallet/subscriptions'));
    expect(subscriptions.request.method).toBe('GET');
    subscriptions.flush({ success: true, data: [] });
  });
});
