import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AssessmentService, GradingItem } from '../shared/services/assessment.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section dir="rtl">
      <h1 class="text-3xl font-bold">طابور التصحيح</h1>
      <p class="text-slate-600 mt-2">راجع التسليمات، أضف الدرجة والملاحظات، ثم انشر النتيجة للطالب.</p>
      <p *ngIf="loading" class="mt-8">جار التحميل...</p>
      <p *ngIf="error" class="mt-8 text-red-700">{{ error }}</p>
      <div class="mt-6 bg-white rounded-xl shadow overflow-x-auto">
        <table class="w-full text-right">
          <thead class="bg-slate-100"><tr><th class="p-3">الطالب</th><th class="p-3">التقييم</th><th class="p-3">الكورس</th><th class="p-3">الحالة</th><th class="p-3"></th></tr></thead>
          <tbody>
            <tr *ngFor="let item of items" class="border-t">
              <td class="p-3">{{ item.student.fullName }}</td>
              <td class="p-3">{{ item.title }}<small class="block">{{ item.type === 'test' ? 'اختبار' : 'واجب' }}</small></td>
              <td class="p-3">{{ item.courseTitle }}</td>
              <td class="p-3">{{ stateLabel(item.state) }}</td>
              <td class="p-3"><a [routerLink]="['/teacher/grading', item.type, item.id]" class="text-orange-700">مراجعة</a></td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!loading && !items.length" class="p-6">لا توجد تسليمات.</p>
      </div>
    </section>
  `,
})
export class TeacherGradingQueueComponent implements OnInit {
  items: GradingItem[] = [];
  loading = true;
  error = '';

  constructor(private assessments: AssessmentService) {}

  ngOnInit(): void {
    this.assessments.getGradingQueue().subscribe({
      next: response => this.items = response.data ?? [],
      error: () => this.error = 'تعذر تحميل طابور التصحيح.',
      complete: () => this.loading = false,
    });
  }

  stateLabel(state: string): string {
    return ({ draft: 'مسودة', submitted: 'بانتظار التصحيح', graded: 'جاهز للنشر', released: 'منشور' } as Record<string, string>)[state] ?? state;
  }
}
