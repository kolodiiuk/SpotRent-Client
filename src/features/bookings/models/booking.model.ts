import { Address } from "../../user-profile/models/address.model";
import {LiqPayPaymentData} from '../../subscriptions/models/subscription.model';
import {PaginationMeta} from '../../../app/models';

export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Active = 2,
  Completed = 3,
  Cancelled = 4,
}

export enum PaymentStatus {
  Paid = 0,
  Failed = 1,
  TestPaid = 2,
  NotPaid = 3,
}

export interface Booking {
  id: number;
  status: BookingStatus;
  spaceId: number;
  spaceName: string;
  address?: Address | null;
  room?: string;
  imageUrl?: string;
  startTime: string;
  endTime: string;
  hourlyRate: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentProcessedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string | null;
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
