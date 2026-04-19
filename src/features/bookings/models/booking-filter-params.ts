import {PaymentStatus} from './payment-status';
import {BookingStatus} from './booking-status';

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
