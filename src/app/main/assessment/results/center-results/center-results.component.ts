import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { TableColumn, TableComponent } from '../../../../shared/components/table/table.component';

interface CenterResult {
  id: string;
  subject: string;
  studentStatus: string;
  totalScore: string;
  serialNumber: string;
}

@Component({
  selector: 'app-center-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableComponent,
    BreadcrumbComponent
  ],
  templateUrl: './center-results.component.html',
  styleUrl: './center-results.component.scss'
})
export class CenterResultsComponent implements OnInit {
  breadcrumbItems = [
    { label: 'الرئيسية', routerLink: '/dashboard' },
    { label: 'نتائج السنتر', isActive: true }
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
      label: 'تحميل الشهادة',
      command: (data: any) => this.downloadCertificate(data),
      visible: (data: any) => this.canDownloadCertificate(data)
    },
    {
      icon: 'pi pi-refresh',
      label: 'إعادة الاختبار',
      command: (data: any) => this.retakeTest(data),
      visible: (data: any) => this.canRetakeTest(data)
    }
  ];

  centerResults: CenterResult[] = [
    {
      id: '1',
      serialNumber: '12323',
      subject: 'اللغة العربية',
      studentStatus: 'ناجح',
      totalScore: '47/60'
    },
    {
      id: '2',
      serialNumber: '3434',
      subject: 'اللغة الفرنسية',
      studentStatus: 'ناجح',
      totalScore: '52/60'
    },
    {
      id: '3',
      serialNumber: '656456',
      subject: 'Mathematics',
      studentStatus: 'ناجح',
      totalScore: '36/40'
    },
    {
      id: '4',
      serialNumber: '12323',
      subject: 'العلوم',
      studentStatus: 'ناجح',
      totalScore: '50/60'
    },
    {
      id: '5',
      serialNumber: '3434',
      subject: 'امتحان الدخول',
      studentStatus: 'ناجح',
      totalScore: '77/80'
    },
    {
      id: '6',
      serialNumber: '656456',
      subject: 'الكيمياء',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '11/40'
    },
    {
      id: '7',
      serialNumber: '12323',
      subject: 'الفيزياء',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '19/60'
    },
    {
      id: '8',
      serialNumber: '656456',
      subject: 'الفيزياء',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '27/80'
    },
    {
      id: '9',
      serialNumber: '3434',
      subject: 'Mathematics',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '33/80'
    },
    {
      id: '10',
      serialNumber: '656456',
      subject: 'امتحان الدخول',
      studentStatus: 'يحب اعادة الامتحان',
      totalScore: '22/60'
    }
  ];

  ngOnInit(): void {
    this.totalRecords = this.centerResults.length;
    this.loadResults();
  }

  loadResults(): void {
    this.isLoadingResults = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoadingResults = false;
    }, 1000);
  }

  viewResultDetails(result: CenterResult): void {
    console.log('View result details:', result);
    // Navigate to detailed result view
    // this.router.navigate(['/assessments/results', result.id]);
  }

  downloadCertificate(result: CenterResult): void {
    console.log('Download certificate for:', result);
    // Implement certificate download
    if (this.canDownloadCertificate(result)) {
      this.generateCertificate(result);
    }
  }

  retakeTest(result: CenterResult): void {
    console.log('Retake test for:', result);
    // Navigate to retake test
    if (confirm(`هل تريد إعادة اختبار ${result.subject}؟`)) {
      // this.router.navigate(['/assessments/retake', result.id]);
      alert('سيتم توجيهك لإعادة الاختبار');
    }
  }

  canDownloadCertificate(result: CenterResult): boolean {
    // Only allow certificate download for passed students
    return result.studentStatus === 'ناجح';
  }

  canRetakeTest(result: CenterResult): boolean {
    // Only allow retake for failed students
    return result.studentStatus === 'يحب اعادة الامتحان';
  }

  exportResults(): void {
    console.log('Export center results to Excel');
    
    const csvContent = this.generateCSV();
    this.downloadCSV(csvContent, 'center-results.csv');
  }

  private generateCSV(): string {
    const headers = ['التسلسل', 'المادة', 'حالة الطالب', 'النتيجة الكلية'];
    const csvRows = [headers.join(',')];
    
    this.centerResults.forEach(result => {
      const row = [
        result.serialNumber,
        result.subject,
        result.studentStatus,
        result.totalScore
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

  private generateCertificate(result: CenterResult): void {
    // Generate and download certificate
    const certificateContent = `
شهادة نجاح

هذا يشهد أن الطالب قد نجح في اختبار:
المادة: ${result.subject}
النتيجة: ${result.totalScore}
التاريخ: ${new Date().toLocaleDateString('ar-EG')}

تهانينا على النجاح!
    `;
    
    const blob = new Blob([certificateContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `certificate-${result.subject}-${result.serialNumber}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  refreshResults(): void {
    this.loadResults();
  }

  // Helper method to get overall performance summary
  getPerformanceSummary(): any {
    const passed = this.centerResults.filter(r => r.studentStatus === 'ناجح').length;
    const failed = this.centerResults.filter(r => r.studentStatus === 'يحب اعادة الامتحان').length;
    const total = this.centerResults.length;
    
    return {
      passed,
      failed,
      total,
      passRate: Math.round((passed / total) * 100)
    };
  }
}