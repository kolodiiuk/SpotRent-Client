import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Booking} from '../models/booking.model';
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

  createBooking(req: CreateBookingPayload): Observable<void> {
    return this.http.post<void>(this.apiUrl, req);
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getUserBookingHistory(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/users/history`);
  }

  getUserActiveBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/users/active`);
  }

  getOwnerBookingHistory(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/owners`);
  }

  getOwnerActiveBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/owners/active`);
  }

  filterBookings(filter: BookingFilterParams): Observable<Booking[]> {
    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach((key) => {
        const value = (filter as any)[key];
        if (value != null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<Booking[]>(`${this.apiUrl}/filter`, {params});
  }

  getBooking(id: number) : Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }
}
