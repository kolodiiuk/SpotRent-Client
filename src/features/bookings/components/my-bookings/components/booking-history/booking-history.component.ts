import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Booking } from '../../../../models/booking.model';
import { BookingStatus } from '../../../../models/booking-status';

@Component({
  selector: 'booking-history',
  imports: [CommonModule, RouterModule],
  templateUrl: 'booking-history.component.html',
  styleUrl: 'booking-history.component.css'
})
export class BookingHistoryComponent {
  @Input() bookings: Booking[] = [];

  getResultClass(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.Completed:
        return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
      case BookingStatus.Cancelled:
        return 'bg-danger-100 text-danger-700 dark:bg-danger-900/40 dark:text-danger-300';
      default:
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300';
    }
  }

  getResultLabel(status: BookingStatus): string {
    return BookingStatus[status];
  }
}
