import { CommonModule } from '@angular/common';
import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateBookingPayload } from '../../models/create-booking-payload';
import { BookingCreationResponse } from '../../models/booking.model';

type BookingSubmitState = 'idle' | 'invalid' | 'subscription-covered' | 'payment-required';

@Component({
  selector: 'booking-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'booking-form.component.html',
  styleUrl: 'booking-form.component.css'
})
export class BookingFormComponent implements OnChanges {
  @Input() defaultSpaceId: number | null = null;
  @Input() isSpaceAvailable = true;
  @Input() hourlyRate: number | null = null;

  submitState: BookingSubmitState = 'idle';
  submitMessage = '';
  pendingLiqPayPayload: BookingCreationResponse['liqPayPaymentData'] | null = null;

  private fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    spaceId: [0, [Validators.required, Validators.min(1)]],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    // Temporary placeholder switch to model post-create flow branches.
    hasSubscriptionForSpace: [true]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultSpaceId'] && this.defaultSpaceId && this.defaultSpaceId > 0) {
      this.form.patchValue({ spaceId: this.defaultSpaceId });
    }
  }

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

  onSubmit(): void {
    this.form.markAllAsTouched();
    this.submitState = 'idle';
    this.submitMessage = '';
    this.pendingLiqPayPayload = null;

    if (!this.isSpaceAvailable || this.form.invalid) {
      this.submitState = 'invalid';
      this.submitMessage = 'Fill required fields and ensure the selected space is available.';
      return;
    }

    const payload = this.buildPayload();
    this.processCreateBookingFlow(payload, this.form.controls.hasSubscriptionForSpace.value);
  }

  private buildPayload(): CreateBookingPayload {
    return {
      spaceId: this.form.controls.spaceId.value,
      startTime: this.toIsoString(this.form.controls.startTime.value),
      endTime: this.toIsoString(this.form.controls.endTime.value)
    };
  }

  private processCreateBookingFlow(payload: CreateBookingPayload, hasSubscriptionForSpace: boolean): void {
    // TODO: replace this placeholder with:
    // bookingService.createBooking(payload).subscribe(response => this.handleCreateBookingResponse(response, hasSubscriptionForSpace));
    const draftResponse: BookingCreationResponse = {
      bookingId: 0,
      liqPayPaymentData: null
    };

    this.handleCreateBookingResponse(draftResponse, hasSubscriptionForSpace);
  }

  private handleCreateBookingResponse(
    response: BookingCreationResponse,
    hasSubscriptionForSpace: boolean
  ): void {
    if (hasSubscriptionForSpace) {
      this.submitState = 'subscription-covered';
      this.submitMessage =
        'Booking will proceed without payment redirect when an active space subscription exists.';
      return;
    }

    this.submitState = 'payment-required';
    this.pendingLiqPayPayload = response.liqPayPaymentData ?? null;
    this.submitMessage =
      'Payment is required. TODO: redirect user to LiqPay page using response.liqPayPaymentData.';
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
