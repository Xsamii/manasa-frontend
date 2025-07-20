import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'badge' | 'link' | 'score';
  linkText?: string; // For link type columns
}

export interface TableAction {
  icon: string;
  label: string;
  command: (data: any) => void;
  visible?: (data: any) => boolean;
}

export interface PageSizeOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() totalRecords: number = 0;
  @Input() lazy: boolean = false;
  @Input() loading: boolean = false;
  @Input() showPaginator: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() showExport: boolean = true;
  @Input() showShare: boolean = true;
  @Input() showHeader: boolean = true;
  @Input() showActions: boolean = true;
  @Input() pageSize: number = 10;
  @Input() emptyMessage: string = 'لا توجد بيانات للعرض';

  @Output() lazyLoad = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  @Output() export = new EventEmitter<void>();
  @Output() shareData = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  searchValue: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  displayedData: any[] = [];
  
  // Menu state
  activeMenuRow: number | null = null;
  menuPosition = { top: 0, left: 0 };

  pageSizeOptions: PageSizeOption[] = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 }
  ];

  ngOnInit() {
    this.updateDisplayedData();
    this.calculateTotalPages();
  }

  ngOnChanges() {
    this.updateDisplayedData();
    this.calculateTotalPages();
  }

  // Data Management
  updateDisplayedData() {
    if (this.lazy) {
      this.displayedData = this.data;
    } else {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.displayedData = this.data.slice(startIndex, endIndex);
    }
  }

  calculateTotalPages() {
    const total = this.lazy ? this.totalRecords : this.data.length;
    this.totalPages = Math.ceil(total / this.pageSize);
  }

  // Pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateDisplayedData();
      this.pageChange.emit(page);
      
      if (this.lazy) {
        this.lazyLoad.emit({
          first: (page - 1) * this.pageSize,
          rows: this.pageSize,
          page: page - 1
        });
      }
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  getVisiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const totalPages = this.totalPages;
    const current = this.currentPage;

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      pages.push(1);
      
      if (current > 4) {
        pages.push('...');
      }
      
      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (current < totalPages - 3) {
        pages.push('...');
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updateDisplayedData();
    this.pageSizeChange.emit(this.pageSize);
    
    if (this.lazy) {
      this.lazyLoad.emit({
        first: 0,
        rows: this.pageSize,
        page: 0
      });
    }
  }

  // Search
  onSearch() {
    this.search.emit(this.searchValue);
    
    if (!this.lazy) {
      // Client-side search
      if (this.searchValue.trim()) {
        const filtered = this.data.filter(item => 
          this.columns.some(col => {
            const value = this.getFieldValue(item, col.field);
            return value?.toString().toLowerCase().includes(this.searchValue.toLowerCase());
          })
        );
        this.displayedData = filtered.slice(0, this.pageSize);
        this.totalPages = Math.ceil(filtered.length / this.pageSize);
      } else {
        this.updateDisplayedData();
        this.calculateTotalPages();
      }
      this.currentPage = 1;
    }
  }

  // Actions Menu
  toggleRowMenu(rowIndex: number, event: Event) {
    event.stopPropagation();
    
    if (this.activeMenuRow === rowIndex) {
      this.closeMenu();
      return;
    }

    this.activeMenuRow = rowIndex;
    
    // Calculate menu position
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    
    this.menuPosition = {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 120 // Offset to align properly
    };
  }

  closeMenu() {
    this.activeMenuRow = null;
  }

  executeAction(action: TableAction, data: any) {
    action.command(data);
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close menu when clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.actions-menu') && !target.closest('.actions-menu-btn')) {
      this.closeMenu();
    }
  }

  // Export & Share
  exportExcel() {
    this.export.emit();
  }

  share() {
    this.shareData.emit();
  }

  // Utility Functions
  getFieldValue(obj: any, field: string): any {
    return field.split('.').reduce((o, key) => o?.[key], obj);
  }

  getBadgeClass(value: string): string {
    // Normalize the value for comparison
    const normalizedValue = value?.toString().toLowerCase().trim();
    
    // Status mappings
    const statusMappings: { [key: string]: string } = {
      // Arabic Status
      'ناجح': 'status-success',
      'نجح': 'status-success',
      'مكتمل': 'status-success',
      'تم الدفع': 'status-paid',
      'مدفوع': 'status-paid',
      'نشط': 'status-active',
      
      'فاشل': 'status-error',
      'لم يتم الدفع': 'status-unpaid',
      'غير مدفوع': 'status-unpaid',
      'يحتاج اعادة الامتحان': 'status-error',
      'يحب اعادة الامتحان': 'status-error',
      
      'قيد المراجعة': 'status-warning',
      'قيد التنفيذ': 'status-warning',
      'منتظر': 'status-pending',
      
      // Subscription types
      'إشتراكاتي': 'subscription-monthly',
      'اشتراكاتي': 'subscription-monthly',
      'يدوي': 'subscription-manual',
      
      // English equivalents
      'success': 'status-success',
      'paid': 'status-paid',
      'active': 'status-active',
      'completed': 'status-completed',
      
      'failed': 'status-error',
      'unpaid': 'status-unpaid',
      'error': 'status-error',
      
      'pending': 'status-pending',
      'processing': 'status-warning',
      'warning': 'status-warning',
      
      'monthly': 'subscription-monthly',
      'manual': 'subscription-manual'
    };
    
    return statusMappings[normalizedValue] || 'status-info';
  }

  getScoreClass(score: string): string {
    if (!score) return '';
    
    // Extract numeric value from score (e.g., "47/60" -> 47)
    const match = score.match(/(\d+)\/(\d+)/);
    if (!match) return '';
    
    const achieved = parseInt(match[1]);
    const total = parseInt(match[2]);
    const percentage = (achieved / total) * 100;
    
    if (percentage >= 85) return 'score-excellent';
    if (percentage >= 70) return 'score-good';
    if (percentage >= 50) return 'score-average';
    return 'score-poor';
  }

  getTotalColumns(): number {
    return this.columns.length + (this.showActions ? 1 : 0);
  }

  // Loading state management
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  // Data refresh
  refreshData() {
    if (this.lazy) {
      this.lazyLoad.emit({
        first: (this.currentPage - 1) * this.pageSize,
        rows: this.pageSize,
        page: this.currentPage - 1
      });
    } else {
      this.updateDisplayedData();
    }
  }

  // Utility method to add new data (useful for real-time updates)
  addData(newItem: any, position: 'start' | 'end' = 'start') {
    if (position === 'start') {
      this.data.unshift(newItem);
    } else {
      this.data.push(newItem);
    }
    this.updateDisplayedData();
    this.calculateTotalPages();
  }

  // Utility method to update existing data
  updateData(updatedItem: any, identifier: string = 'id') {
    const index = this.data.findIndex(item => item[identifier] === updatedItem[identifier]);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updatedItem };
      this.updateDisplayedData();
    }
  }

  // Utility method to remove data
  removeData(identifier: string, value: any) {
    this.data = this.data.filter(item => item[identifier] !== value);
    this.updateDisplayedData();
    this.calculateTotalPages();
    
    // Adjust current page if necessary
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.goToPage(this.totalPages);
    }
  }
}