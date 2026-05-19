import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  Booking,
  BookingCollectionResponse,
  BookingCreationResponse,
  BookingFilterResponse
} from '../models/booking.model';
import {environment} from '../../../environments/environment';
import {BookingFilterParams} from '../models/booking-filter-params';
import {CreateBookingPayload} from '../models/create-booking-payload';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.serverApiUrl}/bookings`;

  constructor(private http: HttpClient) {
  }

  createBooking(req: CreateBookingPayload): Observable<BookingCreationResponse> {
    return this.http.post<BookingCreationResponse>(this.apiUrl, req);
  }

  getUserBookingHistory(): Observable<BookingCollectionResponse> {
    return this.http.get<BookingCollectionResponse>(`${this.apiUrl}/users/history`);
  }

  getUserActiveBookings(): Observable<BookingCollectionResponse> {
    return this.http.get<BookingCollectionResponse>(`${this.apiUrl}/users/active`);
  }

  getOwnerBookingHistory(): Observable<BookingCollectionResponse> {
    return this.http.get<BookingCollectionResponse>(`${this.apiUrl}/owners`);
  }

  getOwnerActiveBookings(): Observable<BookingCollectionResponse> {
    return this.http.get<BookingCollectionResponse>(`${this.apiUrl}/owners/active`);
  }

  filterBookings(filter: BookingFilterParams): Observable<BookingFilterResponse> {
    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach((key) => {
        const value = (filter as any)[key];
        if (value != null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<BookingFilterResponse>(`${this.apiUrl}/filter`, {params});
  }

  getBooking(id: number) : Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }
}
