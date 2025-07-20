import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    FileUploadModule,
    InputMaskModule,
    PasswordModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  registrationForm!: FormGroup;
  
  // Country codes options
  countryCodes: DropdownOption[] = [
    { label: '+20 مصر', value: '+20' },
    { label: '+966 السعودية', value: '+966' },
    { label: '+971 الإمارات', value: '+971' },
    { label: '+965 الكويت', value: '+965' },
    { label: '+973 البحرين', value: '+973' },
    { label: '+974 قطر', value: '+974' },
    { label: '+968 عمان', value: '+968' },
    { label: '+962 الأردن', value: '+962' },
    { label: '+961 لبنان', value: '+961' },
    { label: '+963 سوريا', value: '+963' },
    { label: '+964 العراق', value: '+964' },
    { label: '+967 اليمن', value: '+967' },
    { label: '+212 المغرب', value: '+212' },
    { label: '+213 الجزائر', value: '+213' },
    { label: '+216 تونس', value: '+216' },
    { label: '+218 ليبيا', value: '+218' },
    { label: '+249 السودان', value: '+249' }
  ];

  // Dropdown options
  governorates: DropdownOption[] = [
    { label: 'اختر اسم محافظتك', value: '' },
    { label: 'القاهرة', value: 'cairo' },
    { label: 'الجيزة', value: 'giza' },
    { label: 'الإسكندرية', value: 'alexandria' },
    { label: 'الأقصر', value: 'luxor' },
    { label: 'أسوان', value: 'aswan' },
    { label: 'البحر الأحمر', value: 'red_sea' },
    { label: 'الدقهلية', value: 'dakahlia' },
    { label: 'الشرقية', value: 'sharqia' },
    { label: 'القليوبية', value: 'qalyubia' },
    { label: 'كفر الشيخ', value: 'kafr_el_sheikh' },
    { label: 'الغربية', value: 'gharbia' },
    { label: 'المنوفية', value: 'monufia' },
    { label: 'البحيرة', value: 'beheira' },
    { label: 'الإسماعيلية', value: 'ismailia' },
    { label: 'السويس', value: 'suez' },
    { label: 'بورسعيد', value: 'port_said' },
    { label: 'دمياط', value: 'damietta' },
    { label: 'شمال سيناء', value: 'north_sinai' },
    { label: 'جنوب سيناء', value: 'south_sinai' },
    { label: 'الفيوم', value: 'fayoum' },
    { label: 'بني سويف', value: 'beni_suef' },
    { label: 'المنيا', value: 'minya' },
    { label: 'أسيوط', value: 'asyut' },
    { label: 'سوهاج', value: 'sohag' },
    { label: 'قنا', value: 'qena' },
    { label: 'الوادي الجديد', value: 'new_valley' },
    { label: 'مطروح', value: 'matrouh' }
  ];

  studyYears: DropdownOption[] = [
    { label: 'اختر سنتك الدراسية', value: '' },
    { label: 'السنة الأولى', value: 'year1' },
    { label: 'السنة الثانية', value: 'year2' },
    { label: 'السنة الثالثة', value: 'year3' },
    { label: 'السنة الرابعة', value: 'year4' },
    { label: 'السنة الخامسة', value: 'year5' },
    { label: 'السنة السادسة', value: 'year6' }
  ];

  genders: DropdownOption[] = [
    { label: 'اختر الجنس', value: '' },
    { label: 'ذكر', value: 'male' },
    { label: 'أنثى', value: 'female' }
  ];

  sectors: DropdownOption[] = [
    { label: 'اختر الشعبة', value: '' },
    { label: 'علمي', value: 'science' },
    { label: 'أدبي', value: 'literature' }
  ];

  nationalities: DropdownOption[] = [
    { label: 'اختر الجنسية', value: '' },
    { label: 'مصري', value: 'egyptian' },
    { label: 'سعودي', value: 'saudi' },
    { label: 'إماراتي', value: 'emirati' },
    { label: 'كويتي', value: 'kuwaiti' },
    { label: 'بحريني', value: 'bahraini' },
    { label: 'قطري', value: 'qatari' },
    { label: 'عماني', value: 'omani' },
    { label: 'أردني', value: 'jordanian' },
    { label: 'لبناني', value: 'lebanese' },
    { label: 'سوري', value: 'syrian' },
    { label: 'عراقي', value: 'iraqi' },
    { label: 'يمني', value: 'yemeni' },
    { label: 'مغربي', value: 'moroccan' },
    { label: 'جزائري', value: 'algerian' },
    { label: 'تونسي', value: 'tunisian' },
    { label: 'ليبي', value: 'libyan' },
    { label: 'سوداني', value: 'sudanese' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      countryCode: ['+20', [Validators.required]], // Default to Egypt
      phoneNumber: ['', [Validators.required, this.phoneNumberValidator.bind(this)]],
      fatherCountryCode: ['+20', [Validators.required]],
      fatherPhoneNumber: ['', [Validators.required, this.phoneNumberValidator.bind(this)]],
      motherCountryCode: ['+20', [Validators.required]],
      motherPhoneNumber: ['', [Validators.required, this.phoneNumberValidator.bind(this)]],
      schoolName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      governorate: ['', [Validators.required]],
      studyYear: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      profileImage: [null],
      idImage: [null]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator for password confirmation
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Dynamic phone number validator based on country code
  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const countryCode = this.registrationForm?.get('countryCode')?.value || 
                       this.registrationForm?.get('fatherCountryCode')?.value || 
                       this.registrationForm?.get('motherCountryCode')?.value;
    
    // Phone number patterns for different countries
    const phonePatterns: { [key: string]: RegExp } = {
      '+20': /^1[0-9]{9}$/, // Egypt: 10 digits starting with 1
      '+966': /^5[0-9]{8}$/, // Saudi Arabia: 9 digits starting with 5
      '+971': /^5[0-9]{8}$/, // UAE: 9 digits starting with 5
      '+965': /^[0-9]{8}$/, // Kuwait: 8 digits
      '+973': /^[0-9]{8}$/, // Bahrain: 8 digits
      '+974': /^[0-9]{8}$/, // Qatar: 8 digits
      '+968': /^[0-9]{8}$/, // Oman: 8 digits
      '+962': /^7[0-9]{8}$/, // Jordan: 9 digits starting with 7
      '+961': /^[0-9]{8}$/, // Lebanon: 8 digits
      '+963': /^9[0-9]{8}$/, // Syria: 9 digits starting with 9
      '+964': /^7[0-9]{9}$/, // Iraq: 10 digits starting with 7
      '+967': /^7[0-9]{8}$/, // Yemen: 9 digits starting with 7
      '+212': /^[0-9]{9}$/, // Morocco: 9 digits
      '+213': /^[0-9]{9}$/, // Algeria: 9 digits
      '+216': /^[0-9]{8}$/, // Tunisia: 8 digits
      '+218': /^9[0-9]{8}$/, // Libya: 9 digits starting with 9
      '+249': /^9[0-9]{8}$/ // Sudan: 9 digits starting with 9
    };

    const pattern = phonePatterns[countryCode];
    if (!pattern) {
      return { invalidCountryCode: true };
    }

    return pattern.test(control.value) ? null : { invalidPhoneNumber: true };
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Form submitted:', this.registrationForm.value);
      // Handle form submission here
    } else {
      console.log('Form is invalid');
      this.markAllFieldsAsTouched();
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      this.registrationForm.get(key)?.markAsTouched();
    });
  }

  onFileSelect(event: any, fieldName: string): void {
    const file = event.files[0];
    if (file) {
      this.registrationForm.patchValue({
        [fieldName]: file
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Enhanced error handling
  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'هذا الحقل مطلوب';
      if (field.errors['email']) return 'البريد الإلكتروني غير صحيح';
      if (field.errors['minlength']) return 'الحد الأدنى للأحرف غير مستوفى';
      if (field.errors['invalidPhoneNumber']) return 'رقم الهاتف غير صحيح';
      if (field.errors['invalidCountryCode']) return 'كود الدولة غير صحيح';
    }
    
    // Check for password mismatch error
    if (fieldName === 'confirmPassword' && this.registrationForm.errors?.['passwordMismatch']) {
      return 'كلمة المرور غير متطابقة';
    }
    
    return '';
  }

  // Helper method to get phone number pattern hint
  getPhoneNumberHint(countryCode: string): string {
    const hints: { [key: string]: string } = {
      '+20': '10 أرقام تبدأ بـ 1',
      '+966': '9 أرقام تبدأ بـ 5',
      '+971': '9 أرقام تبدأ بـ 5',
      '+965': '8 أرقام',
      '+973': '8 أرقام',
      '+974': '8 أرقام',
      '+968': '8 أرقام',
      '+962': '9 أرقام تبدأ بـ 7',
      '+961': '8 أرقام',
      '+963': '9 أرقام تبدأ بـ 9',
      '+964': '10 أرقام تبدأ بـ 7',
      '+967': '9 أرقام تبدأ بـ 7',
      '+212': '9 أرقام',
      '+213': '9 أرقام',
      '+216': '8 أرقام',
      '+218': '9 أرقام تبدأ بـ 9',
      '+249': '9 أرقام تبدأ بـ 9'
    };
    return hints[countryCode] || 'أدخل رقم صحيح';
  }
}