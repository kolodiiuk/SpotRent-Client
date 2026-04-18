import {Duration} from './duration';

export interface CreateSubscriptionPlanDto {
  name: string;
  description: string;
  price: number;
  duration: Duration;
  includedHours: number;
}
