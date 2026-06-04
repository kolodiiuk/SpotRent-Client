import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { BookingStatus } from '../../models/booking-status';
import { Booking, BookingCollectionResponse } from '../../models/booking.model';
import { PaymentStatus } from '../../models/payment-status';
import { BookingService } from '../../services/booking.service';
import { MyBookingHistoryComponent } from './my-booking-history.component';

describe('MyBookingHistoryComponent', () => {
  let fixture: ComponentFixture<MyBookingHistoryComponent>;
  let bookingService: { getUserBookingHistory: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    bookingService = {
      getUserBookingHistory: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MyBookingHistoryComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: BookingService, useValue: bookingService }
      ]
    }).compileComponents();
  });

  it('loads and renders booking history', () => {
    bookingService.getUserBookingHistory.mockReturnValue(of(collectionResponse([booking()])));

    fixture = TestBed.createComponent(MyBookingHistoryComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(bookingService.getUserBookingHistory).toHaveBeenCalledTimes(1);
    expect(compiled.textContent).toContain('Main coworking room');
    expect(compiled.textContent).toContain('BOOKING_STATUS.COMPLETED');
    expect(compiled.textContent).not.toContain('USER_BOOKINGS.NO_HISTORY');
  });

  it('shows the empty state after a successful empty load', () => {
    bookingService.getUserBookingHistory.mockReturnValue(of(collectionResponse([])));

    fixture = TestBed.createComponent(MyBookingHistoryComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('USER_BOOKINGS.NO_HISTORY');
    expect(compiled.querySelector('app-error')).toBeNull();
  });

  it('shows a retry-friendly error when the API request fails', () => {
    bookingService.getUserBookingHistory.mockReturnValue(throwError(() => new Error('Network error')));

    fixture = TestBed.createComponent(MyBookingHistoryComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('USER_BOOKINGS.ERROR_HISTORY');
    expect(compiled.textContent).toContain('COMMON.TRY_AGAIN');
    expect(compiled.textContent).not.toContain('USER_BOOKINGS.NO_HISTORY');
  });

  function collectionResponse(data: Booking[]): BookingCollectionResponse {
    return {
      data,
      pagination: {
        page: 1,
        pageSize: data.length,
        total: data.length,
        totalPages: 1
      }
    };
  }

  function booking(): Booking {
    return {
      id: 17,
      status: BookingStatus.Completed,
      spaceId: 4,
      spaceName: 'Main coworking room',
      startTime: '2099-01-01T09:00:00.000Z',
      endTime: '2099-01-01T11:00:00.000Z',
      hourlyRate: 25,
      total: 50,
      paymentStatus: PaymentStatus.Paid,
      createdAt: '2098-12-01T09:00:00.000Z',
      updatedAt: '2098-12-01T09:00:00.000Z'
    };
  }
});
