import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { BookingStatus } from '../../models/booking-status';
import { catchError, Observable, of, map } from 'rxjs';
import { LoaderComponent } from '../../../../app/shared/components/loader.component';

@Component({
  selector: 'owner-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, LoaderComponent],
  templateUrl: 'owner-bookings.component.html'
})
export class OwnerBookingsComponent implements OnInit {
  activeBookings$!: Observable<Booking[]>;
  private bookingService = inject(BookingService);

  ngOnInit() {
    this.activeBookings$ = this.bookingService.getOwnerActiveBookings().pipe(
      map(response => response.data),
      catchError(_ => of([]))
    );
  }

  getStatusClass(status: BookingStatus) {
    switch(status) {
      case BookingStatus.Pending: return 'bg-warning-100 text-warning-800 dark:bg-warning-900/40 dark:text-warning-300';
      case BookingStatus.Confirmed: return 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300';
      case BookingStatus.Active: return 'bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-300';
      case BookingStatus.Completed: return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
      case BookingStatus.Cancelled: return 'bg-danger-100 text-danger-800 dark:bg-danger-900/40 dark:text-danger-300';
      default: return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
    }
  }

  getStatusLabel(status: BookingStatus) {
    return BookingStatus[status];
  }
}
