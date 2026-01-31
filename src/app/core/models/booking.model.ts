import { Address } from "./address.model";

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
