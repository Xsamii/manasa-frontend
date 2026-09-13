import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AppNotification, NotificationService } from '../shared/services/notification.service';
import { AuthService } from '../shared/services/auth.service';
import { userInitials } from '../shared/utils/user-initials';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, OverlayPanelModule],
  template: `
    <div class="min-h-screen bg-slate-50" dir="rtl">
      <nav class="bg-slate-900 text-white px-6 py-4 flex flex-wrap gap-4 items-center">
        <a routerLink="/teacher" class="text-xl font-bold ml-auto">مساحة المعلم</a>
        <a routerLink="/teacher" routerLinkActive="text-orange-400" [routerLinkActiveOptions]="{ exact: true }">كورساتي</a>
        <a routerLink="/teacher/grading" routerLinkActive="text-orange-400">التصحيح</a>
        <a routerLink="/teacher/forum" routerLinkActive="text-orange-400">منتدى الكورسات</a>
        <a routerLink="/teacher/operations" routerLinkActive="text-orange-400">الأكواد والاسترداد</a>
        <a routerLink="/teacher/students" routerLinkActive="text-orange-400">طلبات التسجيل</a>
        <a routerLink="/teacher/report" routerLinkActive="text-orange-400">شيت المشاهدات</a>
        <button class="relative" (click)="showNotifications = !showNotifications">
          إشعارات
          <span *ngIf="unread" class="bg-red-600 rounded-full px-2 text-xs">{{ unread }}</span>
        </button>
        <button class="mr-auto flex items-center gap-2 rounded-full bg-slate-800 pr-1 pl-3 py-1" (click)="accountMenu.toggle($event)">
          <span class="w-9 h-9 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center">{{ initials }}</span>
          <span class="hidden sm:flex flex-col items-end leading-tight">
            <span class="text-sm font-semibold max-w-[9rem] truncate">{{ auth.currentUser?.fullName }}</span>
            <span class="text-[11px] text-slate-300">معلم</span>
          </span>
        </button>
        <p-overlayPanel #accountMenu>
          <div class="w-56" dir="rtl">
            <p class="font-semibold p-3 border-b">{{ auth.currentUser?.fullName }}</p>
            <a routerLink="/teacher/account" class="block p-3 hover:bg-slate-50" (click)="accountMenu.hide()">إدارة الحساب</a>
            <a routerLink="/security" class="block p-3 hover:bg-slate-50" (click)="accountMenu.hide()">الأمان والجلسات</a>
            <button class="block w-full text-right p-3 text-red-700 hover:bg-red-50" (click)="logout()">تسجيل خروج</button>
          </div>
        </p-overlayPanel>
      </nav>
      <aside *ngIf="showNotifications" class="fixed left-4 top-16 z-50 w-80 max-w-[90vw] bg-white shadow-xl rounded-xl p-4" dir="rtl">
        <div class="flex justify-between border-b pb-2 mb-2">
          <strong>الإشعارات</strong>
          <button class="text-orange-700 text-xs" (click)="readAll()">تحديد الكل كمقروء</button>
        </div>
        <button *ngFor="let item of notifications" class="block w-full text-right p-3 rounded hover:bg-slate-50" (click)="open(item)">
          <strong class="block text-sm">{{ item.title }}</strong>
          <span class="text-xs text-slate-600">{{ item.message }}</span>
        </button>
        <p *ngIf="!notifications.length" class="text-slate-500 text-center p-4">لا توجد إشعارات.</p>
      </aside>
      <main class="max-w-7xl mx-auto p-4 md:p-8"><router-outlet /></main>
    </div>
  `,
})
export class TeacherLayoutComponent implements OnInit {
  unread = 0;
  showNotifications = false;
  notifications: AppNotification[] = [];

  constructor(
    private readonly service: NotificationService,
    readonly auth: AuthService,
  ) {}

  get initials(): string {
    return userInitials(this.auth.currentUser?.fullName);
  }

  logout(): void {
    this.auth.logout().subscribe({ error: () => undefined });
  }

  ngOnInit(): void {
    this.service.unreadCount().subscribe({
      next: response => {
        if (response.success) this.unread = response.data.count;
      },
    });
    this.service.list(1, 10).subscribe({
      next: response => {
        if (response.success) this.notifications = response.data.items;
      },
    });
  }

  open(item: AppNotification): void {
    if (!item.readAt) this.service.markRead(item.id).subscribe({ next: () => this.ngOnInit() });
    if (item.link) window.location.href = item.link;
  }

  readAll(): void {
    this.service.markAllRead().subscribe({ next: () => this.ngOnInit() });
  }
}
