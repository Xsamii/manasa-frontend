import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuItem } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AuthService } from '../../../shared/services/auth.service';
import { UserRole } from '../../../shared/models/user.model';
import { AppNotification, NotificationService } from '../../../shared/services/notification.service';
import { WalletService } from '../../../shared/services/wallet.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
   imports: [
     CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    BadgeModule,
    AvatarModule,
    MenuModule,
    InputSwitchModule,
    OverlayPanelModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
   walletBalance = 0;
  searchTerm = '';
  notificationCount = 0;
  notifications: AppNotification[] = [];
  isDarkMode = false;
  showMobileSearch = false;
  showAccountSubmenu = false;
  profileMenuItems: MenuItem[] = [];

  constructor(
    private auth: AuthService,
    private readonly notificationService: NotificationService,
    private readonly wallet: WalletService,
    private readonly router: Router,
  ) {}

  get currentUser() {
    return this.auth.currentUser;
  }

  get isStudent(): boolean {
    return this.currentUser?.role === UserRole.STUDENT;
  }

  get isTeacher(): boolean {
    return this.currentUser?.role === UserRole.TEACHER;
  }

  ngOnInit() {
    this.profileMenuItems = [];
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
    this.refreshNotifications();
    if (this.isStudent) {
      this.wallet.getBalance().subscribe({
        next: response => {
          if (response.success) this.walletBalance = response.data.balance;
        },
      });
    }
  }

  toggleTheme() {
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  applyTheme() {
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  searchCourses(): void {
    const query = this.searchTerm.trim();
    void this.router.navigate(['/courses'], {
      queryParams: query ? { q: query } : {},
    });
  }

  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;
  }
  toggleAccountSubmenu(){
    this.showAccountSubmenu = !this.showAccountSubmenu;
  }

  showNotifications(panel: { toggle: (event: Event) => void }, event: Event) {
    panel.toggle(event);
    this.notificationService.list(1, 10).subscribe({
      next: response => {
        if (response.success) this.notifications = response.data.items;
      },
    });
  }

  openNotification(item: AppNotification): void {
    if (!item.readAt) {
      this.notificationService.markRead(item.id).subscribe({
        next: () => this.refreshNotifications(),
      });
    }
    if (item.link) window.location.href = item.link;
  }

  markAllRead(): void {
    this.notificationService.markAllRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(item => ({
          ...item,
          readAt: item.readAt ?? new Date().toISOString(),
        }));
        this.notificationCount = 0;
      },
    });
  }

  private refreshNotifications(): void {
    this.notificationService.unreadCount().subscribe({
      next: response => {
        if (response.success) this.notificationCount = response.data.count;
      },
    });
  }

  logout() {
    this.auth.logout().subscribe({ error: () => undefined });
  }
}