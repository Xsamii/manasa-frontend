import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
   title = 'منيسرة - منصة التعلم الإلكتروني';

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    // Configure PrimeNG for RTL
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation({
      accept: 'موافق',
      reject: 'رفض',
      choose: 'اختر',
      upload: 'رفع',
      cancel: 'إلغاء',
      dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      dayNamesShort: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
      dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
      monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      today: 'اليوم',
      clear: 'مسح',
      weekHeader: 'أسبوع',
      firstDayOfWeek: 6, // Saturday
      dateFormat: 'dd/mm/yy',
      weak: 'ضعيف',
      medium: 'متوسط',
      strong: 'قوي',
      passwordPrompt: 'أدخل كلمة المرور'
    });
  }
}