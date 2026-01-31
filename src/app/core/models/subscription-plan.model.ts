export enum Duration {
  Week = 0,
  TwoWeeks = 1,
  Month = 2,
  ThreeMonths = 3,
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: Duration;
  includedHours: number;
}

export interface CreateSubscriptionPlanRequest {
  name: string;
  description: string;
  price: number;
  duration: Duration;
  includedHours: number;
}

export interface UpdateSubscriptionPlanRequest {
  name: string;
  description: string;
  price: number;
}

export const durationLabels: Record<Duration, string> = {
  [Duration.Week]: '1 Week',
  [Duration.TwoWeeks]: '2 Weeks',
  [Duration.Month]: '1 Month',
  [Duration.ThreeMonths]: '3 Months',
};
