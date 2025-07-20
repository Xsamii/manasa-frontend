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
   walletBalance = 1453;
  notificationCount = 3;
  isDarkMode = false;
  showMobileSearch = false;
  showAccountSubmenu = false;
  profileMenuItems: MenuItem[] = [];

  ngOnInit() {
    // Keep for backward compatibility if needed
    this.profileMenuItems = [];
  }

  toggleTheme() {
    console.log('Toggle theme:', this.isDarkMode);
  }

  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;
  }
  toggleAccountSubmenu(){
    this.showAccountSubmenu = !this.showAccountSubmenu;
  }

  showNotifications() {
    console.log('Show notifications');
  }

  logout() {
    console.log('Logout');
    // Implement logout logic here
  }
}