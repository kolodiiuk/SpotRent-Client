import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, finalize, map, Observable, of, shareReplay } from 'rxjs';
import { ErrorComponent } from '../../../../app/shared/components/error/error.component';
import { LoaderComponent } from '../../../../app/shared/components/loader.component';
import { Booking } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';
import { ActiveBookingsComponent } from './components/active-bookings/active-bookings.component';

@Component({
  selector: 'my-bookings',
  standalone: true,
  imports: [CommonModule, TranslateModule, ActiveBookingsComponent, ErrorComponent, LoaderComponent],
  templateUrl: 'my-bookings.component.html',
  styleUrl: 'my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {
  activeBookings$!: Observable<Booking[]>;
  isLoading = false;
  error = '';

  constructor(
    private bookingService: BookingService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadActiveBookings();
  }

  loadActiveBookings(): void {
    this.isLoading = true;
    this.error = '';

    this.activeBookings$ = this.bookingService.getUserActiveBookings().pipe(
      map(response => response.data ?? []),
      catchError((err: unknown) => {
        this.error = this.getErrorMessage(err);
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      }),
      shareReplay(1)
    );
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return this.translate.instant('USER_BOOKINGS.ERROR_ACTIVE');
  }
}
