export interface DropdownOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  totalRecords?: number;
}

export interface PaginatedData<T> {
  items: T[];
  totalRecords: number;
  page: number;
  pageSize: number;
}

export interface LazyLoadEvent {
  first: number;
  rows: number;
  sortField?: string;
  sortOrder?: number;
  filters?: any;
  globalFilter?: string;
}