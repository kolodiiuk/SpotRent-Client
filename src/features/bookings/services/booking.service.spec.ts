import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from './booking.service';
import { CreateBookingPayload } from '../models/create-booking-payload';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:5271/api/bookings';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService]
    });

    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('posts create booking payload to the bookings endpoint', () => {
    const payload: CreateBookingPayload = {
      spaceId: 12,
      startTime: '2099-01-01T08:00:00.000Z',
      endTime: '2099-01-01T10:00:00.000Z'
    };
    const response = {
      bookingId: 42,
      liqPayPaymentData: {
        data: 'encoded-data',
        signature: 'signed-data'
      }
    };

    service.createBooking(payload).subscribe(result => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(response);
  });

  it('gets user active bookings from the user active endpoint', () => {
    const response = {
      data: [],
      pagination: {
        page: 1,
        pageSize: 0,
        total: 0,
        totalPages: 1
      }
    };

    service.getUserActiveBookings().subscribe(result => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${baseUrl}/users/active`);
    expect(req.request.method).toBe('GET');

    req.flush(response);
  });
});
