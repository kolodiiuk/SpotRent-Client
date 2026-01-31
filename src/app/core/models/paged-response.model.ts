import { Booking, BookingStatus, PaymentStatus } from "./booking.model";
import { LiqPayPaymentData } from "./subscription.model.js";

export interface PagedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
}
//todo: move dtos somewhere
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
}

export interface BookingCollectionResponse {
  data: Booking[];
  pagination: PaginationMeta;
}

export interface BookingFilterResponse {
  bookings: Booking[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface CreateBookingPayload {
  spaceId: number;
  startTime: string;
  endTime: string;
}

export interface BookingCreationResponse {
  bookingId: number;
  liqPayPaymentData?: LiqPayPaymentData | null;
}

export interface BookingFilterParams {
  userId: number;
  spaceId?: number;
  startTime?: string;
  endTime?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  sort?: string;
  page?: number;
  pageSize?: number;
}
