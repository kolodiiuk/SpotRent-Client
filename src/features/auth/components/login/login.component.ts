import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {GoogleAuthService} from '../../services/google-auth.service';
import {CardComponent} from '../../../../app/shared/components';
import {ButtonComponent} from '../../../../app/shared/components';
import {InputComponent} from '../../../../app/shared/components';
import {AlertComponent} from '../../../../app/shared/components';
import {GoogleLoginComponent} from '../../../../app/shared/components';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.css',
  imports: [
    CardComponent,
    ButtonComponent,
    InputComponent,
    AlertComponent,
    GoogleLoginComponent,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword = false;
  private returnUrl = '';
  protected readonly clientId = environment.clientId;
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();

      return;
    }

    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['returnUrl']) {
      this.returnUrl = nav.extras.state['returnUrl'];
    }
    if (nav?.extras?.state?.['message']) {
      this.successMessage = nav.extras.state['message'];
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
    this.successMessage = null;

    const {email, password} = this.form.value;

    this.authService.login(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.redirectBasedOnRole(),
        error: (err: any) => {
          this.errorMessage =
            err?.error?.message ??
            err?.message ??
            'Login failed';
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

  handleGoogleSuccess(credential: string): void {
    this.googleAuthService.loginWithGoogle(credential)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.redirectBasedOnRole(),
        error: () => this.errorMessage = 'Google Sign-In failed'
      });
  }

  handleGoogleError(error: any): void {
    console.error('Google Auth Error:', error);
    this.errorMessage = 'Google Sign-In failed';
  }

  private redirectBasedOnRole(): void {
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl, { replaceUrl: true });
      return;
    }

    const role = this.authService.getUserRole();
    const path = role === 'ADMIN' ? '/admin' : role === 'OWNER' ? '/owner' : '/user';
    this.router.navigate([path], {replaceUrl: true});
  }

  get emailError(): string | undefined {
    const control = this.form.get('email');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'Email is required';
      }
      if (control.hasError('email')) {
        return 'Please enter a valid email address';
      }
    }
    return undefined;
  }

  get passwordError(): string | undefined {
    const control = this.form.get('password');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'Password is required';
      }
    }
    return undefined;
  }
}
