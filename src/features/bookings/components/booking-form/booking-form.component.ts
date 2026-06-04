import { CommonModule } from '@angular/common';
import {Component, inject, Input} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CreateBookingPayload } from '../../models/create-booking-payload';
import { BookingCreationResponse } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';
import { submitLiqPayCheckout } from '../../../../app/shared/utils/liqpay-checkout';
import { LocaleService } from '../../../../app/services/locale.service';
import { LocalDatePipe, LocalTimePipe } from '../../../../app/shared/pipes';

type BookingSubmitState = 'idle' | 'invalid' | 'subscription-covered' | 'payment-required' | 'api-error';

@Component({
  selector: 'booking-form',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LocalDatePipe, LocalTimePipe],
  templateUrl: 'booking-form.component.html',
  styleUrl: 'booking-form.component.css'
})
export class BookingFormComponent {
  @Input() defaultSpaceId: number | null = null;
  @Input() hourlyRate: number | null = null;

  submitState: BookingSubmitState = 'idle';
  submitMessage = '';
  isSubmitting = false;
  pendingLiqPayPayload: BookingCreationResponse['liqPayPaymentData'] | null = null;

  private fb = inject(FormBuilder);
  private bookingService = inject(BookingService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  readonly locale = inject(LocaleService);

  readonly form = this.fb.nonNullable.group({
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  });

  get estimatedTotal(): number | null {
    if (this.hourlyRate == null) {
      return null;
    }

    const start = this.parseDate(this.form.controls.startTime.value);
    const end = this.parseDate(this.form.controls.endTime.value);
    if (!start || !end || end <= start) {
      return null;
    }

    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.round(hours * this.hourlyRate * 100) / 100;
  }

  get selectedStartTime(): string {
    return this.form.controls.startTime.value;
  }

  get selectedEndTime(): string {
    return this.form.controls.endTime.value;
  }

  onSubmit(): void {
    if (this.isSubmitting) {
      return;
    }

    this.form.markAllAsTouched();
    this.submitState = 'idle';
    this.submitMessage = '';
    this.pendingLiqPayPayload = null;

    if (!this.defaultSpaceId || this.defaultSpaceId < 1 || this.form.invalid) {
      this.submitState = 'invalid';
      this.submitMessage = this.translate.instant('BOOKING_FORM.ERROR_REQUIRED_TIMES');
      return;
    }

    const payload = this.buildPayload();
    this.processCreateBookingFlow(payload);
  }

  private buildPayload(): CreateBookingPayload {
    return {
      spaceId: this.defaultSpaceId!,
      startTime: this.toIsoString(this.form.controls.startTime.value),
      endTime: this.toIsoString(this.form.controls.endTime.value)
    };
  }

  private processCreateBookingFlow(payload: CreateBookingPayload): void {
    this.isSubmitting = true;
    this.bookingService.createBooking(payload)
      .pipe(finalize(() => {
        this.isSubmitting = false;
      }))
      .subscribe({
        next: response => this.handleCreateBookingResponse(response),
        error: error => this.handleCreateBookingError(error)
      });
  }

  private handleCreateBookingResponse(response: BookingCreationResponse): void {
    this.pendingLiqPayPayload = response.liqPayPaymentData ?? null;
    if (this.pendingLiqPayPayload) {
      this.submitState = 'payment-required';
      this.submitMessage = this.translate.instant('BOOKING_FORM.PAYMENT_REQUIRED');
      submitLiqPayCheckout(this.pendingLiqPayPayload);
      return;
    }

    this.submitState = 'subscription-covered';
    this.submitMessage = this.translate.instant('BOOKING_FORM.SUBSCRIPTION_COVERED');
    void this.router.navigate(['/user/my-bookings', response.bookingId]);
  }

  private handleCreateBookingError(error: unknown): void {
    this.submitState = 'api-error';
    this.submitMessage = this.mapCreateBookingError(error);
  }

  private mapCreateBookingError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return this.translate.instant('BOOKING_FORM.ERROR_CREATE');
    }

    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    if (error.status === 400) {
      return this.translate.instant('BOOKING_FORM.ERROR_INVALID_REQUEST');
    }

    if (error.status === 401) {
      return this.translate.instant('BOOKING_FORM.ERROR_UNAUTHORIZED');
    }

    return this.translate.instant('BOOKING_FORM.ERROR_CREATE');
  }

  get submitMessageClasses(): string {
    const baseClasses = 'mt-4 rounded-md border px-3 py-2 text-sm';
    switch (this.submitState) {
      case 'subscription-covered':
        return `${baseClasses} border-success-200 dark:border-success-900/50 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300`;
      case 'payment-required':
        return `${baseClasses} border-warning-200 dark:border-warning-900/50 bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300`;
      case 'api-error':
        return `${baseClasses} border-danger-200 dark:border-danger-900/50 bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300`;
      default:
        return `${baseClasses} border-neutral-300 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-800/70 text-neutral-700 dark:text-neutral-300`;
    }
  }

  private toIsoString(value: string): string {
    const date = this.parseDate(value);
    return date ? date.toISOString() : value;
  }

  private parseDate(value: string): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
