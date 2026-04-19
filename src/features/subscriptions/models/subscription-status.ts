export enum SubscriptionStatus {
  Active = 0,
  Cancelled = 1 << 0,
  Expired = 1 << 1,
  NotPaid = 1 << 2,
}
