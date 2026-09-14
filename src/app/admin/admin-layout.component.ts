import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50" dir="rtl">
      <nav class="bg-slate-900 text-white px-6 py-4 flex flex-wrap gap-4 items-center">
        <a routerLink="/admin" class="text-xl font-bold ml-auto">مساحة الإدارة</a>
        <span class="text-sm text-slate-300">{{ auth.currentUser?.fullName }}</span>
        <button class="rounded-full bg-slate-800 px-4 py-1.5 text-sm" (click)="logout()">تسجيل خروج</button>
      </nav>
      <main class="max-w-5xl mx-auto p-4 md:p-8"><router-outlet /></main>
    </div>
  `,
})
export class AdminLayoutComponent {
  constructor(readonly auth: AuthService) {}

  logout(): void {
    this.auth.logout().subscribe({ error: () => undefined });
  }
}
