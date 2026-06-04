import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BookingStatus } from '../../models/booking-status';
import { PaymentStatus } from '../../models/payment-status';
import { Booking } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';
import { LoaderComponent } from '../../../../app/shared/components/loader.component';
import { LocalDatePipe, LocalTimePipe } from '../../../../app/shared/pipes';

@Component({
  selector: 'booking-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LoaderComponent, LocalDatePipe, LocalTimePipe],
  templateUrl: 'booking-details.component.html',
  styleUrl: 'booking-details.component.css'
})
export class BookingDetailsComponent implements OnInit {
  booking: Booking | null = null;
  isLoading = false;
  error = '';
  listLink = '/user/my-bookings';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.listLink = this.router.url.startsWith('/owner/') ? '/owner/bookings' : '/user/my-bookings';

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this.error = this.translate.instant('USER_BOOKINGS.ERROR_INVALID_ID');
        this.booking = null;
        return;
      }

      this.fetchBooking(id);
    });
  }

  getStatusLabel(status: BookingStatus): string {
    return BookingStatus[status];
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    return PaymentStatus[status];
  }

  getStatusKey(status: BookingStatus): string {
    return `BOOKING_STATUS.${this.getStatusLabel(status).toUpperCase()}`;
  }

  getPaymentStatusKey(status: PaymentStatus): string {
    return `PAYMENT_STATUS.${this.getPaymentStatusLabel(status).toUpperCase()}`;
  }

  getStatusClass(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.Pending:
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/40 dark:text-warning-300';
      case BookingStatus.Confirmed:
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300';
      case BookingStatus.Active:
        return 'bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-300';
      case BookingStatus.Completed:
        return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
      case BookingStatus.Cancelled:
        return 'bg-danger-100 text-danger-800 dark:bg-danger-900/40 dark:text-danger-300';
      default:
        return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
    }
  }

  private fetchBooking(id: number): void {
    this.isLoading = true;
    this.error = '';
    this.booking = null;

    this.bookingService.getBooking(id).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load booking details', err);
        this.error = this.translate.instant('USER_BOOKINGS.ERROR_DETAILS');
        this.isLoading = false;
      }
    });
  }
}
