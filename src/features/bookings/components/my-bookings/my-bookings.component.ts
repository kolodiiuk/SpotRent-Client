import { Component } from '@angular/core';
import { Booking } from '../../models/booking.model';
import { ActiveBookingsComponent } from './components/active-bookings/active-bookings.component';

@Component({
  selector: 'my-bookings',
  standalone: true,
  imports: [ActiveBookingsComponent],
  templateUrl: 'my-bookings.component.html',
  styleUrl: 'my-bookings.component.css'
})
export class MyBookingsComponent {
  // UI scaffolding only. API wiring will bind this array later.
  readonly activeBookings: Booking[] = [];
}
