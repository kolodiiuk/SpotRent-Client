import {LiqPayPaymentData} from './liq-pay-payment-data';

export interface SubscriptionCreationResponse {
  subscriptionId: number;
  liqPayPaymentData: LiqPayPaymentData;
}
