import {SubscriptionDto} from './subscription-dto.model';
import {SubscriptionHistoryEntry} from './subscription-history-entry';
import {SubscriptionPlan} from '../../subscription-plans/models/subscription-plan';

export interface SubscriptionWithPlan {
  subscription: SubscriptionDto;
  plan: SubscriptionPlan;
}

export interface SubscriptionHistoryWithPlan {
  entry: SubscriptionHistoryEntry;
  plan: SubscriptionPlan;
}
