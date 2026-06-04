import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Booking } from '../../models/booking.model';
import { BookingStatus } from '../../models/booking-status';
import { BookingService } from '../../services/booking.service';
import { LoaderComponent } from '../../../../app/shared/components/loader.component';
import { LocalDatePipe, LocalTimePipe } from '../../../../app/shared/pipes';

@Component({
  selector: 'owner-booking-history',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LoaderComponent, LocalDatePipe, LocalTimePipe],
  templateUrl: 'owner-booking-history.component.html'
})
export class OwnerBookingHistoryComponent implements OnInit {
  historyBookings$!: Observable<Booking[]>;
  private bookingService = inject(BookingService);

  ngOnInit() {
    this.historyBookings$ = this.bookingService.getOwnerBookingHistory().pipe(
      map(response => response.data.filter(b =>
        b.status === BookingStatus.Completed ||
        b.status === BookingStatus.Cancelled
      )),
      catchError(_ => of([]))
    );
  }

  getStatusClass(status: BookingStatus) {
    switch (status) {
      case BookingStatus.Completed:
        return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
      case BookingStatus.Cancelled:
        return 'bg-danger-100 text-danger-800 dark:bg-danger-900/40 dark:text-danger-300';
      default:
        return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
    }
  }

  getStatusKey(status: BookingStatus) {
    return `BOOKING_STATUS.${BookingStatus[status].toUpperCase()}`;
  }
}
