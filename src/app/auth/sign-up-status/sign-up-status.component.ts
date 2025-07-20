import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sign-up-status',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './sign-up-status.component.html',
  styleUrl: './sign-up-status.component.scss',
})
export class SignUpStatusComponent {
  
}
