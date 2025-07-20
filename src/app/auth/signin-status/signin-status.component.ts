import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-signin-status',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './signin-status.component.html',
  styleUrl: './signin-status.component.scss'
})
export class SigninStatusComponent {
constructor(private router: Router) {}

  ngOnInit(): void {
    // Auto redirect after 5 seconds
    setTimeout(() => {
      this.goToDashboard();
    }, 5000);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToCourses(): void {
    this.router.navigate(['/courses']);
  }
}