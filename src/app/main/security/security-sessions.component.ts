import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService, DeviceSession } from '../../shared/services/auth.service';

@Component({
  selector: 'app-security-sessions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="max-w-3xl mx-auto p-6" dir="rtl">
      <h1 class="text-3xl font-bold">الأمان والجلسات</h1>
      <p class="text-slate-600 mt-2">راجع الأجهزة النشطة وألغ الجلسات غير المعروفة.</p>
      <p *ngIf="error" class="mt-4 text-red-700">{{ error }}</p>
      <article *ngFor="let session of sessions" class="bg-white rounded-xl border p-4 mt-4">
        <div class="flex justify-between gap-4">
          <div>
            <strong>{{ session.device }}</strong>
            <p class="text-sm text-slate-500">{{ session.ipAddress }}</p>
            <p class="text-xs text-slate-400">بدأ {{ session.createdAt | date:'short' }} · ينتهي {{ session.expiresAt | date:'short' }}</p>
          </div>
          <span *ngIf="session.current" class="text-emerald-700 text-sm">الجلسة الحالية</span>
          <button *ngIf="!session.current" class="text-red-700" (click)="revoke(session)">إنهاء</button>
        </div>
      </article>
      <p *ngIf="!loading && !sessions.length" class="mt-6 text-slate-500">لا توجد جلسات نشطة.</p>
    </main>
  `,
})
export class SecuritySessionsComponent implements OnInit {
  sessions: DeviceSession[] = [];
  loading = true;
  error = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.auth.getActiveSessions().subscribe({
      next: (response) => {
        this.sessions = response.success ? response.data : [];
        this.loading = false;
      },
      error: () => {
        this.error = 'تعذر تحميل الجلسات.';
        this.loading = false;
      },
    });
  }

  revoke(session: DeviceSession): void {
    this.auth.revokeSession(session.id).subscribe({
      next: () => this.load(),
      error: () => this.error = 'تعذر إنهاء الجلسة.',
    });
  }
}
