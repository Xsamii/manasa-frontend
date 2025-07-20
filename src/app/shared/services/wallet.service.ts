import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse, PaginatedData } from '../models/common.model';

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'charge' | 'payment' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: Date;
}

export interface WalletBalance {
  balance: number;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly API_URL = '/api/wallet';
  private balanceSubject = new BehaviorSubject<number>(0);
  public balance$ = this.balanceSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadBalance();
  }

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

  // Charge wallet with amount
  chargeWallet(amount: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/charge`, { amount }).pipe(
      tap(response => {
        if (response.success) {
          this.loadBalance(); // Refresh balance
        }
      })
    );
  }

  // Charge wallet with code
  chargeWithCode(code: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/charge-code`, { code }).pipe(
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
  getPurchaseHistory(params?: any): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/purchases`, {
      params
    });
  }

  private loadBalance(): void {
    this.getBalance().subscribe();
  }
}