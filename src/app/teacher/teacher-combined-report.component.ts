import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { STUDY_YEAR_OPTIONS } from '../shared/models/study-year';
import { StudyYearPipe } from '../shared/pipes/study-year.pipe';
import { TeacherOpsService, Center, CombinedRow, ReviewStudent } from './teacher-ops.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, StudyYearPipe],
  template: `
    <section dir="rtl">
      <h1 class="text-3xl font-bold mb-2">تفاصيل المشاهدات والواجبات والامتحانات</h1>
      <p class="text-slate-500 mb-6">شيت واحد: امتحان / واجب / مشاهدة المحاضرة. صفِّ حسب كل الطلاب أو سنتر أو طالب أو مرحلة داخل سنتر.</p>
      <div class="card grid md:grid-cols-4 gap-3 mb-6">
        <select class="field" [(ngModel)]="centerId">
          <option [ngValue]="undefined">كل السناتر</option>
          <option *ngFor="let center of centers" [ngValue]="center.id">{{ center.name }}</option>
        </select>
        <select class="field" [(ngModel)]="studentId">
          <option [ngValue]="undefined">كل الطلاب</option>
          <option *ngFor="let student of students" [ngValue]="student.id">{{ student.fullName }}</option>
        </select>
        <select class="field" [(ngModel)]="studyYear">
          <option [ngValue]="undefined">كل المراحل</option>
          <option *ngFor="let year of years" [ngValue]="year.value">{{ year.label }}</option>
        </select>
        <div class="flex gap-2">
          <button class="btn flex-1" (click)="load()">عرض</button>
          <button class="secondary" (click)="exportExcel()">Excel</button>
        </div>
      </div>
      <p *ngIf="error" class="text-red-700 mb-4">{{ error }}</p>
      <div class="overflow-auto bg-white rounded-xl border">
        <table class="w-full text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="p-3 text-right">الطالب</th>
              <th class="p-3 text-right">السنتر</th>
              <th class="p-3 text-right">المرحلة</th>
              <th class="p-3 text-right">امتحان</th>
              <th class="p-3 text-right">واجب</th>
              <th class="p-3 text-right">مشاهدة المحاضرة</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of rows" class="border-t">
              <td class="p-3">{{ row.studentName }}</td>
              <td class="p-3">{{ row.centerName }}</td>
              <td class="p-3">{{ row.studyYear | studyYear }}</td>
              <td class="p-3">{{ row.examScore ?? '-' }}</td>
              <td class="p-3">{{ row.homeworkScore ?? '-' }}</td>
              <td class="p-3">{{ row.lectureWatchSeconds }} ث · {{ row.lecturesCompleted }} مكتمل</td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="!rows.length" class="p-8 text-center text-slate-500">لا توجد بيانات لهذه التصفية.</p>
      </div>
    </section>
  `,
  styles: [`
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1rem}
    .field{border:1px solid #cbd5e1;border-radius:.6rem;padding:.7rem;width:100%}
    .btn{background:#ea580c;color:#fff;border-radius:.6rem;padding:.7rem 1rem}
    .secondary{background:#e2e8f0;border-radius:.6rem;padding:.7rem 1rem}
  `],
})
export class TeacherCombinedReportComponent implements OnInit {
  private readonly api = inject(TeacherOpsService);
  years = STUDY_YEAR_OPTIONS;
  centers: Center[] = [];
  students: ReviewStudent[] = [];
  rows: CombinedRow[] = [];
  centerId?: number;
  studentId?: number;
  studyYear?: string;
  error = '';

  ngOnInit(): void {
    this.api.listCenters().subscribe({ next: response => { if (response.success) this.centers = response.data; } });
    this.api.allStudents().subscribe({ next: response => { if (response.success) this.students = response.data; } });
    this.load();
  }

  load(): void {
    this.api.combined({ centerId: this.centerId, studentId: this.studentId, studyYear: this.studyYear }).subscribe({
      next: response => { if (response.success) this.rows = response.data.rows; },
      error: error => this.error = error.error?.message ?? 'تعذر تحميل التقرير',
    });
  }

  exportExcel(): void {
    this.api.exportCombined({ centerId: this.centerId, studentId: this.studentId, studyYear: this.studyYear }).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'exam-homework-lectures.xls';
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.error = 'تعذر تصدير ملف الإكسل',
    });
  }
}
