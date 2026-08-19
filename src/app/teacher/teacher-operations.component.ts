import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WalletService } from '../shared/services/wallet.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section dir="rtl">
      <h1 class="text-3xl font-bold mb-2">العمليات المالية</h1>
      <p class="text-slate-500 mb-6">إصدار أكواد الشحن ومراجعة المشتريات واستردادها.</p>
      <p *ngIf="error" class="text-red-700 mb-4">{{ error }}</p>
      <p *ngIf="issuedCode" class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        الكود الجديد (يظهر مرة واحدة): <strong class="tracking-widest">{{ issuedCode }}</strong>
      </p>
      <form class="card grid md:grid-cols-3 gap-3 mb-8" [formGroup]="form" (ngSubmit)="issue()">
        <input class="field" type="number" min="1" step="0.01" formControlName="amount" placeholder="قيمة الكود">
        <input class="field" type="datetime-local" formControlName="expiresAt">
        <button class="btn" [disabled]="form.invalid">إصدار كود</button>
      </form>
      <div class="grid lg:grid-cols-2 gap-6">
        <article class="card">
          <h2 class="font-bold text-xl mb-4">أكواد الشحن</h2>
          <div *ngFor="let code of codes" class="border-t py-3 text-sm">
            <strong>{{ code.amount }} {{ code.currency }}</strong>
            <span class="block text-slate-500">{{ code.redeemedAt ? 'مستخدم' : 'متاح' }}</span>
          </div>
          <p *ngIf="!codes.length" class="text-slate-500">لا توجد أكواد بعد.</p>
        </article>
        <article class="card">
          <h2 class="font-bold text-xl mb-4">مشتريات الكورسات</h2>
          <div *ngFor="let purchase of purchases" class="border-t py-3">
            <div class="flex justify-between gap-3">
              <div>
                <strong>{{ purchase.title }}</strong>
                <span class="block text-sm text-slate-500">{{ purchase.amount }} {{ purchase.currency }} · {{ purchase.status }}</span>
              </div>
              <button *ngIf="purchase.status === 'completed' && purchase.amount > 0" class="text-red-700" (click)="refund(purchase.id)">استرداد</button>
            </div>
          </div>
          <p *ngIf="!purchases.length" class="text-slate-500">لا توجد مشتريات.</p>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem}
    .field{border:1px solid #cbd5e1;border-radius:.6rem;padding:.7rem;width:100%}
    .btn{background:#ea580c;color:#fff;border-radius:.6rem;padding:.7rem 1rem}
  `],
})
export class TeacherOperationsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly wallet = inject(WalletService);
  codes: Array<{ id: string; amount: number; currency: string; redeemedAt: string | null }> = [];
  purchases: Array<{ id: string; title: string; amount: number; currency: string; status: string }> = [];
  issuedCode = '';
  error = '';
  form = this.fb.nonNullable.group({
    amount: [50, [Validators.required, Validators.min(0.01)]],
    expiresAt: [''],
  });

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.wallet.listIssuedCodes().subscribe({
      next: response => { if (response.success) this.codes = response.data; },
      error: error => this.error = error.error?.message ?? 'تعذر تحميل الأكواد.',
    });
    this.wallet.listTeacherPurchases().subscribe({
      next: response => { if (response.success) this.purchases = response.data; },
      error: error => this.error = error.error?.message ?? 'تعذر تحميل المشتريات.',
    });
  }

  issue(): void {
    const value = this.form.getRawValue();
    this.wallet.createRechargeCode(value.amount, value.expiresAt || undefined).subscribe({
      next: response => {
        if (response.success) this.issuedCode = response.data.code;
        this.refresh();
      },
      error: error => this.error = error.error?.message ?? 'تعذر إصدار الكود.',
    });
  }

  refund(purchaseId: string): void {
    if (!confirm('استرداد هذه العملية وإلغاء الوصول للكورس؟')) return;
    this.wallet.refundPurchase(purchaseId).subscribe({
      next: () => this.refresh(),
      error: error => this.error = error.error?.message ?? 'تعذر الاسترداد.',
    });
  }
}
