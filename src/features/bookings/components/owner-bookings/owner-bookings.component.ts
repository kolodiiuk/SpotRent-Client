import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { BookingStatus } from '../../models/booking-status';
import { catchError, Observable, of, tap, map, shareReplay } from 'rxjs';
import { LoaderComponent } from '../../../../app/shared/components/loader.component';

@Component({
  selector: 'owner-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe, LoaderComponent],
  templateUrl: 'owner-bookings.component.html'
})
export class OwnerBookingsComponent implements OnInit {
  bookings$!: Observable<Booking[]>;
  activeBookings$!: Observable<Booking[]>;
  historyBookings$!: Observable<Booking[]>;

  currentTab: 'active' | 'history' = 'active';
  private bookingService = inject(BookingService);

  ngOnInit() {
    this.bookings$ = this.bookingService.getOwnerBookingHistory().pipe(
      catchError(_ => of([])),
      shareReplay(1)
    );

    this.activeBookings$ = this.bookings$.pipe(
      map(bookings => bookings.filter(b =>
        b.status === BookingStatus.Pending ||
        b.status === BookingStatus.Confirmed ||
        b.status === BookingStatus.Active
      ))
    );

    this.historyBookings$ = this.bookings$.pipe(
      map(bookings => bookings.filter(b =>
        b.status === BookingStatus.Completed ||
        b.status === BookingStatus.Cancelled
      ))
    );
  }

  get displayedBookings$() {
    return this.currentTab === 'active' ? this.activeBookings$ : this.historyBookings$;
  }

  setTab(tab: 'active' | 'history') {
    this.currentTab = tab;
  }

  getStatusClass(status: BookingStatus) {
    switch(status) {
      case BookingStatus.Pending: return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.Confirmed: return 'bg-blue-100 text-blue-800';
      case BookingStatus.Active: return 'bg-green-100 text-green-800';
      case BookingStatus.Completed: return 'bg-gray-100 text-gray-800';
      case BookingStatus.Cancelled: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: BookingStatus) {
    return BookingStatus[status];
  }
}
