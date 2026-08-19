import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppNotification, NotificationService } from '../shared/services/notification.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-50" dir="rtl">
      <nav class="bg-slate-900 text-white px-6 py-4 flex flex-wrap gap-4 items-center">
        <a routerLink="/teacher" class="text-xl font-bold ml-auto">مساحة المعلم</a>
        <a routerLink="/teacher" routerLinkActive="text-orange-400" [routerLinkActiveOptions]="{ exact: true }">كورساتي</a>
        <a routerLink="/teacher/grading" routerLinkActive="text-orange-400">التصحيح</a>
        <a routerLink="/teacher/forum" routerLinkActive="text-orange-400">منتدى الكورسات</a>
        <a routerLink="/teacher/operations" routerLinkActive="text-orange-400">الأكواد والاسترداد</a>
        <a routerLink="/teacher/analytics" routerLinkActive="text-orange-400">التحليلات والإشراف</a>
        <button class="relative" (click)="showNotifications = !showNotifications">
          إشعارات
          <span *ngIf="unread" class="bg-red-600 rounded-full px-2 text-xs">{{ unread }}</span>
        </button>
        <a routerLink="/dashboard">واجهة المنصة</a>
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

  constructor(private readonly service: NotificationService) {}

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
