import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="page-intro" dir="rtl">
      <p *ngIf="kicker" class="page-intro-kicker">{{ kicker }}</p>
      <p class="page-intro-text">{{ text }}</p>
      <ul *ngIf="points.length" class="page-intro-points">
        <li *ngFor="let point of points">{{ point }}</li>
      </ul>
    </aside>
  `,
  styles: [`
    .page-intro {
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      border-radius: 1rem;
      padding: 1rem 1.25rem;
      margin: 0 0 1.5rem;
      color: #134e4a;
    }
    .page-intro-kicker {
      margin: 0 0 0.35rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #ea580c;
    }
    .page-intro-text {
      margin: 0;
      line-height: 1.8;
      color: #334155;
    }
    .page-intro-points {
      margin: 0.75rem 0 0;
      padding-right: 1.2rem;
      color: #475569;
      line-height: 1.8;
    }
  `],
})
export class PageIntroComponent {
  @Input() kicker = 'كيف تستخدم هذه الصفحة';
  @Input() text = '';
  @Input() points: string[] = [];
}
