import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SignInFormComponent } from '../../shared/components/sign-in-form/sign-in-form.component';
import { STUDY_YEAR_OPTIONS } from '../../shared/models/study-year';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, SignInFormComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements AfterViewInit {
  readonly years = STUDY_YEAR_OPTIONS;
  readonly offers = [
    {
      title: 'كورسات فيديو حسب الصف',
      text: 'دروس مرتبة حسب الإعدادي والثانوي، يشرحها معلمون متخصصون، وتظهر كاملة بعد الاشتراك أو الشراء.',
    },
    {
      title: 'واجبات واختبارات',
      text: 'حل الواجبات والاختبارات داخل الكورس، ثم متابعة الدرجة والملاحظات من المعلم.',
    },
    {
      title: 'محفظة واشتراكات',
      text: 'اشحن رصيدك بكود، اشترِ الكورس مرة واحدة، وتابع فواتيرك واشتراكاتك من حسابك.',
    },
    {
      title: 'منتدى لكل كورس',
      text: 'اسأل معلمك وزملاءك داخل الكورس المسجّل به فقط، حتى يبقى النقاش مرتبطاً بالدرس.',
    },
  ];
  readonly teacherOffers = [
    'إنشاء كورس كمسودة ثم نشره بعد إضافة جلسة واحدة على الأقل.',
    'رفع فيديوهات الدروس، الواجبات، والاختبارات لكل جلسة.',
    'تصحيح التسليمات وإصدار أكواد الشحن ومتابعة تقدم الطلاب.',
  ];
  readonly steps = [
    { title: '1. أنشئ حساب طالب', text: 'اختر صفك الدراسي حتى تظهر لك الكورسات المناسبة.' },
    { title: '2. استعرض ثم اشترك', text: 'ترى اسم الكورس والمعلم والسعر أولاً. المحتوى يُفتح بعد الشراء أو التسجيل المجاني.' },
    { title: '3. شاهد وتدرّب', text: 'أكمل الدروس، حل التقييمات، وتابع تقدمك وإحصائياتك من لوحة التحكم.' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    const fragment = this.route.snapshot.fragment;
    if (fragment) {
      document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
