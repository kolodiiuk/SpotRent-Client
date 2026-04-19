import {Duration} from './duration';

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: Duration;
  includedHours: number;
  ownerId: number | null;
  isActive: boolean;
  updatedAt: Date;
}
