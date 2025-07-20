import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { TableColumn, TableComponent } from '../../../../shared/components/table/table.component';

interface HomeworkResult {
  id: string;
  subject: string;
  studentStatus: string;
  totalScore: string;
  serialNumber: string;
  homeworkDate?: Date;
  submissionDate?: Date;
  isLate?: boolean;
}

@Component({
  selector: 'app-homework-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableComponent,
    BreadcrumbComponent
  ],
  templateUrl: './homework-results.component.html',
  styleUrl: './homework-results.component.scss'
})
export class HomeworkResultsComponent implements OnInit {
  breadcrumbItems = [
    { label: 'الرئيسية', routerLink: '/dashboard' },
    { label: 'نتائج الواجب', isActive: true }
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
      command: (data: any) => this.viewHomeworkDetails(data)
    },
    {
      icon: 'pi pi-download',
      label: 'تحميل النتيجة',
      command: (data: any) => this.downloadResult(data)
    },
    {
      icon: 'pi pi-upload',
      label: 'إعادة تسليم',
      command: (data: any) => this.resubmitHomework(data),
      visible: (data: any) => this.canResubmit(data)
    },
    {
      icon: 'pi pi-file-pdf',
      label: 'عرض الواجب',
      command: (data: any) => this.viewHomework(data)
    }
  ];

  homeworkResults: HomeworkResult[] = [
    {
      id: '1',
      serialNumber: '12323',
      subject: 'اللغة العربية',
      studentStatus: 'ناجح',
      totalScore: '47/60',
      submissionDate: new Date('2025-05-10'),
      isLate: false
    },
    {
      id: '2',
      serialNumber: '3434',
      subject: 'اللغة الفرنسية',
      studentStatus: 'ناجح',
      totalScore: '52/60',
      submissionDate: new Date('2025-05-09'),
      isLate: false
    },
    {
      id: '3',
      serialNumber: '656456',
      subject: 'Mathematics',
      studentStatus: 'ناجح',
      totalScore: '36/40',
      submissionDate: new Date('2025-05-08'),
      isLate: false
    },
    {
      id: '4',
      serialNumber: '12323',
      subject: 'العلوم',
      studentStatus: 'ناجح',
      totalScore: '50/60',
      submissionDate: new Date('2025-05-07'),
      isLate: false
    },
    {
      id: '5',
      serialNumber: '3434',
      subject: 'امتحان الدخول',
      studentStatus: 'ناجح',
      totalScore: '77/80',
      submissionDate: new Date('2025-05-06'),
      isLate: false
    },
    {
      id: '6',
      serialNumber: '656456',
      subject: 'الكيمياء',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '11/40',
      submissionDate: new Date('2025-05-05'),
      isLate: true
    },
    {
      id: '7',
      serialNumber: '12323',
      subject: 'الفيزياء',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '19/60',
      submissionDate: new Date('2025-05-04'),
      isLate: true
    },
    {
      id: '8',
      serialNumber: '656456',
      subject: 'الفيزياء',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '27/80',
      submissionDate: new Date('2025-05-03'),
      isLate: false
    },
    {
      id: '9',
      serialNumber: '3434',
      subject: 'Mathematics',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '33/80',
      submissionDate: new Date('2025-05-02'),
      isLate: true
    },
    {
      id: '10',
      serialNumber: '656456',
      subject: 'امتحان الدخول',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '22/60',
      submissionDate: new Date('2025-05-01'),
      isLate: false
    }
  ];

  ngOnInit(): void {
    this.totalRecords = this.homeworkResults.length;
    this.loadResults();
  }

  loadResults(): void {
    this.isLoadingResults = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoadingResults = false;
    }, 1000);
  }

  viewHomeworkDetails(result: HomeworkResult): void {
    console.log('View homework details:', result);
    // Navigate to detailed homework view
    // this.router.navigate(['/assessments/homework/details', result.id]);
  }

  downloadResult(result: HomeworkResult): void {
    console.log('Download homework result for:', result);
    this.generateHomeworkReport(result);
  }

  resubmitHomework(result: HomeworkResult): void {
    console.log('Resubmit homework for:', result);
    if (confirm(`هل تريد إعادة تسليم واجب ${result.subject}؟`)) {
      // Navigate to homework submission page
      // this.router.navigate(['/assessments/homework/submit', result.id]);
      alert('سيتم توجيهك لإعادة تسليم الواجب');
    }
  }

  viewHomework(result: HomeworkResult): void {
    console.log('View homework assignment for:', result);
    // Open homework document/PDF
    // this.router.navigate(['/assessments/homework/view', result.id]);
    alert(`عرض واجب ${result.subject}`);
  }

  canResubmit(result: HomeworkResult): boolean {
    // Allow resubmission for failed homework or if specifically allowed
    return result.studentStatus === 'يحب اعادة الامتحان' || (result.isLate ?? false);
  }

  exportResults(): void {
    console.log('Export homework results to Excel');
    
    const csvContent = this.generateCSV();
    this.downloadCSV(csvContent, 'homework-results.csv');
  }

  private generateCSV(): string {
    const headers = ['التسلسل', 'المادة', 'حالة الطالب', 'النتيجة الكلية', 'تاريخ التسليم', 'متأخر؟'];
    const csvRows = [headers.join(',')];
    
    this.homeworkResults.forEach(result => {
      const row = [
        result.serialNumber,
        result.subject,
        result.studentStatus,
        result.totalScore,
        result.submissionDate?.toLocaleDateString('ar-EG') || '',
        result.isLate ? 'نعم' : 'لا'
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

  private generateHomeworkReport(result: HomeworkResult): void {
    // Generate and download detailed homework report
    const reportContent = `
تقرير نتيجة الواجب

تفاصيل الواجب:
- المادة: ${result.subject}
- النتيجة: ${result.totalScore}
- حالة الطالب: ${result.studentStatus}
- تاريخ التسليم: ${result.submissionDate?.toLocaleDateString('ar-EG') || 'غير محدد'}
- حالة التسليم: ${result.isLate ? 'متأخر' : 'في الوقت المحدد'}
- رقم التسلسل: ${result.serialNumber}
- تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}

${result.studentStatus === 'ناجح' ? 'أحسنت! تم أداء الواجب بنجاح.' : 'نرجو مراجعة الواجب والمحاولة مرة أخرى.'}

${result.isLate ? 'ملاحظة: تم تسليم الواجب متأخراً.' : ''}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `homework-result-${result.subject}-${result.serialNumber}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  refreshResults(): void {
    this.loadResults();
  }

  // Helper methods for homework analysis
  getHomeworkStatistics(): any {
    const completed = this.homeworkResults.filter(r => r.studentStatus === 'ناجح').length;
    const needsResubmission = this.homeworkResults.filter(r => r.studentStatus === 'يحب اعادة الامتحان').length;
    const lateSubmissions = this.homeworkResults.filter(r => r.isLate).length;
    const total = this.homeworkResults.length;
    
    return {
      completed,
      needsResubmission,
      lateSubmissions,
      total,
      completionRate: Math.round((completed / total) * 100),
      lateRate: Math.round((lateSubmissions / total) * 100)
    };
  }

  getSubjectHomeworkStats(): any {
    const subjectStats: { [key: string]: { completed: number; total: number; late: number } } = {};
    
    this.homeworkResults.forEach(result => {
      if (!subjectStats[result.subject]) {
        subjectStats[result.subject] = { completed: 0, total: 0, late: 0 };
      }
      subjectStats[result.subject].total++;
      if (result.studentStatus === 'ناجح') {
        subjectStats[result.subject].completed++;
      }
      if (result.isLate) {
        subjectStats[result.subject].late++;
      }
    });
    
    return subjectStats;
  }

  getAverageHomeworkScore(): number {
    const scores = this.homeworkResults.map(result => {
      const [achieved, total] = result.totalScore.split('/').map(Number);
      return (achieved / total) * 100;
    });
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }
}