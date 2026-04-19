import {Address} from "../../user-profile/models/address.model";
import {PaginationMeta} from '../../../app/models';
import {PaymentStatus} from './payment-status';
import {BookingStatus} from './booking-status';
import {LiqPayPaymentData} from '../../subscriptions/models/liq-pay-payment-data';

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

export interface BookingCreationResponse {
  bookingId: number;
  liqPayPaymentData?: LiqPayPaymentData | null;
}
