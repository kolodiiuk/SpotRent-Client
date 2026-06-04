import { LiqPayPaymentData } from '../../../features/subscriptions/models/liq-pay-payment-data';

export function submitLiqPayCheckout(paymentData: LiqPayPaymentData): void {
  const { data, signature } = paymentData;

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://www.liqpay.ua/api/3/checkout';
  form.acceptCharset = 'utf-8';

  const dataInput = document.createElement('input');
  dataInput.type = 'hidden';
  dataInput.name = 'data';
  dataInput.value = data;

  const signatureInput = document.createElement('input');
  signatureInput.type = 'hidden';
  signatureInput.name = 'signature';
  signatureInput.value = signature;

  form.appendChild(dataInput);
  form.appendChild(signatureInput);
  document.body.appendChild(form);
  form.submit();
}
