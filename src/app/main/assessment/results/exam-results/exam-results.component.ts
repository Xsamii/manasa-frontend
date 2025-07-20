import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { TableColumn, TableComponent } from '../../../../shared/components/table/table.component';

interface ExamResult {
  id: string;
  subject: string;
  studentStatus: string;
  totalScore: string;
  serialNumber: string;
  examDate?: Date;
  examType?: string;
}

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableComponent,
    BreadcrumbComponent
  ],
  templateUrl: './exam-results.component.html',
  styleUrl: './exam-results.component.scss'
})
export class ExamResultsComponent implements OnInit {
  breadcrumbItems = [
    { label: 'الرئيسية', routerLink: '/dashboard' },
    { label: 'نتائج الإمتحانات', isActive: true }
  ];

  isLoadingResults = false;
  totalRecords = 0;

  tableColumns: TableColumn[] = [
    { field: 'serialNumber', header: 'التسلسل', width: '100px' },
    { field: 'subject', header: 'المادة', width: '200px' },
    { field: 'studentStatus', header: 'حالة الطالب', width: '150px' },
    { field: 'totalScore', header: 'النتيجة الكلية', width: '120px', type: 'score' }
  ];

  tableActions = [
    {
      icon: 'pi pi-eye',
      label: 'عرض التفاصيل',
      command: (data: any) => this.viewResultDetails(data)
    },
    {
      icon: 'pi pi-download',
      label: 'تحميل النتيجة',
      command: (data: any) => this.downloadResult(data)
    },
    {
      icon: 'pi pi-refresh',
      label: 'إعادة الإمتحان',
      command: (data: any) => this.retakeExam(data),
      visible: (data: any) => this.canRetakeExam(data)
    },
    {
      icon: 'pi pi-chart-line',
      label: 'عرض الإحصائيات',
      command: (data: any) => this.viewStatistics(data)
    }
  ];

  examResults: ExamResult[] = [
    {
      id: '1',
      serialNumber: '12323',
      subject: 'اللغة العربية',
      studentStatus: 'ناجح',
      totalScore: '47/60',
      examType: 'امتحان شهري'
    },
    {
      id: '2',
      serialNumber: '3434',
      subject: 'اللغة الفرنسية',
      studentStatus: 'ناجح',
      totalScore: '52/60',
      examType: 'امتحان نهائي'
    },
    {
      id: '3',
      serialNumber: '656456',
      subject: 'Mathematics',
      studentStatus: 'ناجح',
      totalScore: '36/40',
      examType: 'امتحان منتصف الفصل'
    },
    {
      id: '4',
      serialNumber: '12323',
      subject: 'العلوم',
      studentStatus: 'ناجح',
      totalScore: '50/60',
      examType: 'امتحان شهري'
    },
    {
      id: '5',
      serialNumber: '3434',
      subject: 'امتحان الدخول',
      studentStatus: 'ناجح',
      totalScore: '77/80',
      examType: 'امتحان القبول'
    },
    {
      id: '6',
      serialNumber: '656456',
      subject: 'الكيمياء',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '11/40',
      examType: 'امتحان نهائي'
    },
    {
      id: '7',
      serialNumber: '12323',
      subject: 'الفيزياء',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '19/60',
      examType: 'امتحان شهري'
    },
    {
      id: '8',
      serialNumber: '656456',
      subject: 'الفيزياء',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '27/80',
      examType: 'امتحان نهائي'
    },
    {
      id: '9',
      serialNumber: '3434',
      subject: 'Mathematics',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '33/80',
      examType: 'امتحان منتصف الفصل'
    },
    {
      id: '10',
      serialNumber: '656456',
      subject: 'امتحان الدخول',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '22/60',
      examType: 'امتحان القبول'
    }
  ];

  ngOnInit(): void {
    this.totalRecords = this.examResults.length;
    this.loadResults();
  }

  loadResults(): void {
    this.isLoadingResults = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoadingResults = false;
    }, 1000);
  }

  viewResultDetails(result: ExamResult): void {
    console.log('View exam result details:', result);
    // Navigate to detailed result view
    // this.router.navigate(['/assessments/results/exam', result.id]);
  }

  downloadResult(result: ExamResult): void {
    console.log('Download result for:', result);
    this.generateResultReport(result);
  }

  retakeExam(result: ExamResult): void {
    console.log('Retake exam for:', result);
    if (confirm(`هل تريد إعادة امتحان ${result.subject}؟`)) {
      // this.router.navigate(['/assessments/retake-exam', result.id]);
      alert('سيتم توجيهك لإعادة الامتحان');
    }
  }

  viewStatistics(result: ExamResult): void {
    console.log('View statistics for:', result);
    // Navigate to statistics view
    // this.router.navigate(['/statistics/exam', result.id]);
    alert(`عرض إحصائيات امتحان ${result.subject}`);
  }

  canRetakeExam(result: ExamResult): boolean {
    // Allow retake for failed students
    return result.studentStatus === 'يحب اعادة الامتحان';
  }

  exportResults(): void {
    console.log('Export exam results to Excel');
    
    const csvContent = this.generateCSV();
    this.downloadCSV(csvContent, 'exam-results.csv');
  }

  private generateCSV(): string {
    const headers = ['التسلسل', 'المادة', 'حالة الطالب', 'النتيجة الكلية', 'نوع الامتحان'];
    const csvRows = [headers.join(',')];
    
    this.examResults.forEach(result => {
      const row = [
        result.serialNumber,
        result.subject,
        result.studentStatus,
        result.totalScore,
        result.examType || ''
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private generateResultReport(result: ExamResult): void {
    // Generate and download detailed result report
    const reportContent = `
تقرير نتيجة الامتحان

تفاصيل النتيجة:
- المادة: ${result.subject}
- نوع الامتحان: ${result.examType || 'غير محدد'}
- النتيجة: ${result.totalScore}
- حالة الطالب: ${result.studentStatus}
- رقم التسلسل: ${result.serialNumber}
- تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}

${result.studentStatus === 'ناجح' ? 'مبروك! لقد نجحت في الامتحان.' : 'نرجو المحاولة مرة أخرى.'}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `exam-result-${result.subject}-${result.serialNumber}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  refreshResults(): void {
    this.loadResults();
  }

  // Helper methods for analysis
  getPassFailSummary(): any {
    const passed = this.examResults.filter(r => r.studentStatus === 'ناجح').length;
    const failed = this.examResults.filter(r => r.studentStatus === 'يحب اعادة الامتحان').length;
    const total = this.examResults.length;
    
    return {
      passed,
      failed,
      total,
      passRate: Math.round((passed / total) * 100)
    };
  }

  getSubjectPerformance(): any {
    const subjectStats: { [key: string]: { passed: number; total: number } } = {};
    
    this.examResults.forEach(result => {
      if (!subjectStats[result.subject]) {
        subjectStats[result.subject] = { passed: 0, total: 0 };
      }
      subjectStats[result.subject].total++;
      if (result.studentStatus === 'ناجح') {
        subjectStats[result.subject].passed++;
      }
    });
    
    return subjectStats;
  }

  getAverageScore(): number {
    const scores = this.examResults.map(result => {
      const [achieved, total] = result.totalScore.split('/').map(Number);
      return (achieved / total) * 100;
    });
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }
}