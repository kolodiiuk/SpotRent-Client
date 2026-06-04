import {Component, input} from '@angular/core';
import {LiqPayPaymentData} from '../../../../features/subscriptions/models/liq-pay-payment-data';

@Component({
  selector: 'app-liqpay-button',
  templateUrl: 'liqpay-button.component.html',
  styleUrl: 'liqpay-button.component.css'
})
export class LiqpayButtonComponent {
  paymentData = input.required<LiqPayPaymentData>();
  checkoutUrl = 'https://www.liqpay.ua/api/3/checkout';
}
