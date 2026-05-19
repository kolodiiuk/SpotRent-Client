import {SubscriptionStatus} from "./subscription-status";

export interface SubscriptionHistoryEntry {
  id: number;
  subscriptionPlanId: number;
  subscriptionPlanName: string;
  subscriptionStatus: SubscriptionStatus | number;
  isActive: boolean;
  startedAt: string;
  expiresAt: string | null;
}
