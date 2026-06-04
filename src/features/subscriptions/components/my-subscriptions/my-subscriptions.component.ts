import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, finalize, Observable, of, shareReplay } from 'rxjs';

import { ErrorComponent } from '../../../../app/shared/components/error/error.component';
import { LoaderComponent } from '../../../../app/shared/components/loader.component';
import { LocalDatePipe } from '../../../../app/shared/pipes';
import {
  paymentStatusLabel,
  paymentStatusVariant,
  subscriptionStatusTokens,
  subscriptionStatusVariant
} from '../../models/subscription-dto.model';
import { SubscriptionWithPlan } from '../../models/subscription-view.model';
import { UserSubscriptionService } from '../../services/user-subscription.service';

@Component({
  selector: 'app-my-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ErrorComponent, LoaderComponent, LocalDatePipe],
  templateUrl: 'my-subscriptions.component.html'
})
export class MySubscriptionsComponent implements OnInit {
  subscriptions$!: Observable<SubscriptionWithPlan[]>;
  isLoading = false;
  error = '';

  readonly subscriptionStatusTokens = subscriptionStatusTokens;
  readonly subscriptionStatusVariant = subscriptionStatusVariant;
  readonly paymentStatusLabel = paymentStatusLabel;
  readonly paymentStatusVariant = paymentStatusVariant;

  constructor(
    private userSubscriptionService: UserSubscriptionService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.isLoading = true;
    this.error = '';

    this.subscriptions$ = this.userSubscriptionService.getMySubscriptions().pipe(
      catchError((err) => {
        this.error = err?.error ?? this.translate.instant('USER_SUBSCRIPTIONS.ERROR_LOAD');
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      }),
      shareReplay(1)
    );
  }

  getSubscriptionStatusKeys(status: number): string[] {
    return this.subscriptionStatusTokens(status).map(token => `SUBSCRIPTION_STATUS.${token.toUpperCase().replace(/ /g, '_')}`);
  }

  getPaymentStatusKey(status: number): string {
    return `PAYMENT_STATUS.${this.paymentStatusLabel(status).toUpperCase().replace(/ /g, '_')}`;
  }
}
