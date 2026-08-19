import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse, PaginatedData } from '../models/common.model';
import { apiUrl } from '../../core/config/api.config';

export interface WalletTransaction {
  id: string;
  amount: number;
  balanceAfter: number;
  currency: string;
  type: 'recharge' | 'purchase' | 'refund';
  status: 'completed';
  description: string;
  createdAt: string;
}

export interface WalletPurchase {
  id: string;
  courseId: number;
  title: string;
  instructor?: string;
  amount: number;
  currency: string;
  status: 'completed' | 'refunded';
  createdAt: string;
}

export interface WalletSubscription {
  id: string;
  courseId: number;
  title: string;
  instructor?: string;
  status: 'active' | 'cancelled';
  enrolledAt: string;
  purchaseId: string | null;
}

export interface WalletBalance {
  balance: number;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly API_URL = apiUrl('wallet');
  private balanceSubject = new BehaviorSubject<number>(0);
  public balance$ = this.balanceSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentBalance(): number {
    return this.balanceSubject.value;
  }

  // Get wallet balance
  getBalance(): Observable<ApiResponse<WalletBalance>> {
    return this.http.get<ApiResponse<WalletBalance>>(`${this.API_URL}/balance`).pipe(
      tap(response => {
        if (response.success) {
          this.balanceSubject.next(response.data.balance);
        }
      })
    );
  }

  // Charge wallet with code
  chargeWithCode(code: string, idempotencyKey = this.newIdempotencyKey()): Observable<ApiResponse<WalletBalance>> {
    return this.http.post<ApiResponse<WalletBalance>>(`${this.API_URL}/charge-code`, { code }, {
      headers: { 'x-idempotency-key': idempotencyKey }
    }).pipe(
      tap(response => {
        if (response.success) {
          this.loadBalance(); // Refresh balance
        }
      })
    );
  }

  // Get transaction history
  getTransactions(params?: any): Observable<ApiResponse<PaginatedData<WalletTransaction>>> {
    return this.http.get<ApiResponse<PaginatedData<WalletTransaction>>>(`${this.API_URL}/transactions`, {
      params
    });
  }

  // Get purchase history
  getPurchaseHistory(params?: any): Observable<ApiResponse<WalletPurchase[]>> {
    return this.http.get<ApiResponse<WalletPurchase[]>>(`${this.API_URL}/purchases`, {
      params
    });
  }

  getSubscriptions(): Observable<ApiResponse<WalletSubscription[]>> {
    return this.http.get<ApiResponse<WalletSubscription[]>>(`${this.API_URL}/subscriptions`);
  }

  getReceipt(purchaseId: string): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${this.API_URL}/purchases/${purchaseId}/receipt`);
  }

  createRechargeCode(amount: number, expiresAt?: string): Observable<ApiResponse<{ code: string; amount: number; currency: string }>> {
    return this.http.post<ApiResponse<{ code: string; amount: number; currency: string }>>(
      `${this.API_URL}/management/recharge-codes`,
      { amount, expiresAt },
    );
  }

  listIssuedCodes(): Observable<ApiResponse<Array<{ id: string; amount: number; currency: string; redeemedAt: string | null }>>> {
    return this.http.get<ApiResponse<Array<{ id: string; amount: number; currency: string; redeemedAt: string | null }>>>(
      `${this.API_URL}/management/recharge-codes`,
    );
  }

  listTeacherPurchases(): Observable<ApiResponse<Array<{ id: string; title: string; amount: number; currency: string; status: string }>>> {
    return this.http.get<ApiResponse<Array<{ id: string; title: string; amount: number; currency: string; status: string }>>>(
      `${this.API_URL}/management/purchases`,
    );
  }

  refundPurchase(purchaseId: string): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(
      `${this.API_URL}/management/purchases/${purchaseId}/refund`,
      {},
    );
  }

  private loadBalance(): void {
    this.getBalance().subscribe({ error: () => undefined });
  }

  private newIdempotencyKey(): string {
    return globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}