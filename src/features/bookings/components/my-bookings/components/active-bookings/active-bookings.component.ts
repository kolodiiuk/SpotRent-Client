import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LocalDatePipe, LocalTimePipe } from '../../../../../../app/shared/pipes';
import { Booking } from '../../../../models/booking.model';
import { BookingStatus } from '../../../../models/booking-status';

@Component({
  selector: 'active-bookings',
  imports: [CommonModule, RouterModule, TranslateModule, LocalDatePipe, LocalTimePipe],
  templateUrl: 'active-bookings.component.html',
  styleUrl: 'active-bookings.component.css'
})
export class ActiveBookingsComponent {
  @Input() bookings: Booking[] = [];

  getStatusClass(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.Pending:
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/40 dark:text-warning-300';
      case BookingStatus.Confirmed:
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300';
      case BookingStatus.Active:
        return 'bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-300';
      default:
        return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
    }
  }

  getStatusLabel(status: BookingStatus): string {
    return BookingStatus[status];
  }

  getStatusKey(status: BookingStatus): string {
    return `BOOKING_STATUS.${this.getStatusLabel(status).toUpperCase()}`;
  }
}
