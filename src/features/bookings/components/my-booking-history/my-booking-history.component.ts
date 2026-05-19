import { Component } from '@angular/core';
import { Booking } from '../../models/booking.model';
import { BookingHistoryComponent } from '../my-bookings/components/booking-history/booking-history.component';

@Component({
  selector: 'my-booking-history',
  standalone: true,
  imports: [BookingHistoryComponent],
  templateUrl: 'my-booking-history.component.html'
})
export class MyBookingHistoryComponent {
  // UI scaffolding only. API wiring will bind this array later.
  readonly bookingHistory: Booking[] = [];
}
