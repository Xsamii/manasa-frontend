export class CommonUtils {
  
  // Format currency
  static formatCurrency(amount: number, currency: string = 'جم'): string {
    return `${amount.toLocaleString('ar-EG')} ${currency}`;
  }

  // Format date in Arabic
  static formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Format time duration
  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} ساعة ${mins > 0 ? `و ${mins} دقيقة` : ''}`;
    }
    return `${mins} دقيقة`;
  }

  // Generate random ID
  static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Debounce function
  static debounce(func: Function, wait: number): Function {
    let timeout: any;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Deep clone object
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  // Check if object is empty
  static isEmpty(obj: any): boolean {
    return obj === null || obj === undefined || 
           (typeof obj === 'object' && Object.keys(obj).length === 0) ||
           (typeof obj === 'string' && obj.trim().length === 0);
  }

  // Validate Egyptian phone number
  static validateEgyptianPhone(phone: string): boolean {
    const phoneRegex = /^1[0-9]{9}$/;
    return phoneRegex.test(phone);
  }

  // Validate email
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Convert Arabic numerals to English
  static arabicToEnglishNumbers(str: string): string {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    for (let i = 0; i < arabicNumbers.length; i++) {
      str = str.replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i]);
    }
    return str;
  }

  // Download file
  static downloadFile(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Copy to clipboard
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  }
}