import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { GoogleAuthService } from '../../../core/services/google-auth.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'register',
  templateUrl: 'register.component.html',
  imports: [
    CardComponent,
    ButtonComponent,
    InputComponent,
    AlertComponent,
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  styleUrl: 'register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  isLoading = false;
  errorMessage: string | null = null;
  registrationSuccess = false;

  showPassword = false;
  showConfirmPassword = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [this.phoneValidator]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordsMatchValidator
    });

    if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();
      const path = role === 'ADMIN' ? '/admin' : role === 'OWNER' ? '/owner' : '/user';
      this.router.navigate([path], { replaceUrl: true });
      return;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { confirmPassword, ...payload } = this.form.value;

    if (!payload.phoneNumber || payload.phoneNumber.trim() === '') {
      payload.phoneNumber = null;
    }

    this.authService.register(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.registrationSuccess = true;

          setTimeout(() => {
            this.router.navigate(['/auth/login'], {
              state: {
                message: 'Registration successful! Please check your email to verify your account.'
              }
            });
          }, 2000);
        },
        error: (err: any) => {
          this.errorMessage =
            err?.error?.message ??
            err?.message ??
            'Registration failed';
          this.isLoading = false;
        }
      });
  }

  clearGlobalError(): void {
    this.errorMessage = null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get passwordStrength() {
    const password = this.form.get('password')?.value as string;
    return this.calculatePasswordStrength(password);
  }

  private phoneValidator(control: any) {
    if (!control.value) {
      return null;
    }
    return /^[\d\s\-+()]{10,}$/.test(control.value)
      ? null
      : { phoneInvalid: true };
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  private calculatePasswordStrength(password: string) {
    if (!password) {
      return { strength: '', color: '', width: '0%' };
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 2) {
      return { strength: 'Weak', color: 'bg-danger-500', width: '33%' };
    }
    if (score <= 4) {
      return { strength: 'Medium', color: 'bg-warning-500', width: '66%' };
    }
    return { strength: 'Strong', color: 'bg-success-500', width: '100%' };
  }

  // was string instead of any
  handleGoogleSuccess(credential: any): void {
    this.googleAuthService.loginWithGoogle(credential)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const role = this.authService.getUserRole();
          const path = role === 'ADMIN' ? '/admin' : role === 'OWNER' ? '/owner' : '/user';
          this.router.navigate([path]);
        },
        error: () => console.error('Google Sign-In failed')
      });
  }

  get firstNameError(): string | undefined {
    const control = this.form.get('firstName');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'First name is required';
      if (control.hasError('minlength')) return 'Must be at least 2 characters';
    }
    return undefined;
  }

  get lastNameError(): string | undefined {
    const control = this.form.get('lastName');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Last name is required';
      if (control.hasError('minlength')) return 'Must be at least 2 characters';
    }
    return undefined;
  }

  get emailError(): string | undefined {
    const control = this.form.get('email');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Email is required';
      if (control.hasError('email')) return 'Please enter a valid email address';
    }
    return undefined;
  }

  get phoneError(): string | undefined {
    const control = this.form.get('phoneNumber');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('phoneInvalid')) return 'Please enter a valid phone number';
    }
    return undefined;
  }

  get passwordError(): string | undefined {
    const control = this.form.get('password');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) return 'Password is required';
      if (control.hasError('minlength')) return 'Must be at least 8 characters';
      if (control.hasError('pattern')) return 'Must contain uppercase, lowercase, and a number';
    }
    return undefined;
  }

  get confirmPasswordError(): string | undefined {
    const control = this.form.get('confirmPassword');
    if (control?.touched) {
      if (control.hasError('required')) return 'Please confirm your password';
      if (this.form.hasError('passwordsMismatch')) return 'Passwords do not match';
    }
    return undefined;
  }

  protected readonly console = console;
}
