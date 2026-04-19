import {SubscriptionStatus} from './subscription-status';
import {SubscriptionPaymentStatus} from './subscription-payment-status';

export interface SubscriptionDto {
  id: number;
  price: number;
  subscriptionPlanId: number;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus | number;
  hoursUsed: number;
  totalAmount: number;
  paymentStatus: SubscriptionPaymentStatus | number;
  paymentProcessedAt?: string | null;
  paymentFailureReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const subscriptionStatusTokens = (status: number): string[] => {
  if (status === SubscriptionStatus.Active) {
    return ['Active'];
  }

  const tokens: string[] = [];
  if ((status & SubscriptionStatus.Cancelled) === SubscriptionStatus.Cancelled) {
    tokens.push('Cancelled');
  }
  if ((status & SubscriptionStatus.Expired) === SubscriptionStatus.Expired) {
    tokens.push('Expired');
  }
  if ((status & SubscriptionStatus.NotPaid) === SubscriptionStatus.NotPaid) {
    tokens.push('Payment pending');
  }

  if (tokens.length === 0) {
    tokens.push('Unknown');
  }

  return tokens;
};

export const subscriptionStatusVariant = (status: number): 'success' | 'warning' | 'danger' | 'info' => {
  if (status === SubscriptionStatus.Active) {
    return 'success';
  }
  if ((status & SubscriptionStatus.Cancelled) === SubscriptionStatus.Cancelled) {
    return 'danger';
  }
  if ((status & SubscriptionStatus.Expired) === SubscriptionStatus.Expired) {
    return 'warning';
  }
  if ((status & SubscriptionStatus.NotPaid) === SubscriptionStatus.NotPaid) {
    return 'info';
  }
  return 'info';
};

export const paymentStatusLabel = (status: SubscriptionPaymentStatus | number): string => {
  switch (status) {
    case SubscriptionPaymentStatus.Paid:
      return 'Paid';
    case SubscriptionPaymentStatus.Failed:
      return 'Failed';
    case SubscriptionPaymentStatus.TestPaid:
      return 'Test Payment';
    case SubscriptionPaymentStatus.NotPaid:
    default:
      return 'Not Paid';
  }
};

export const paymentStatusVariant = (
  status: SubscriptionPaymentStatus | number
): 'success' | 'warning' | 'danger' | 'info' => {
  switch (status) {
    case SubscriptionPaymentStatus.Paid:
    case SubscriptionPaymentStatus.TestPaid:
      return 'success';
    case SubscriptionPaymentStatus.Failed:
      return 'danger';
    case SubscriptionPaymentStatus.NotPaid:
    default:
      return 'warning';
  }
};
