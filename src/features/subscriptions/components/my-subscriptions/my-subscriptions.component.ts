import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { catchError, finalize, Observable, of, shareReplay } from 'rxjs';

import { ErrorComponent } from '../../../../app/shared/components/error/error.component';
import { LoaderComponent } from '../../../../app/shared/components/loader.component';
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
  imports: [CommonModule, RouterModule, ErrorComponent, LoaderComponent],
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

  constructor(private userSubscriptionService: UserSubscriptionService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.isLoading = true;
    this.error = '';

    this.subscriptions$ = this.userSubscriptionService.getMySubscriptions().pipe(
      catchError((err) => {
        this.error = err?.error ?? 'Failed to load subscriptions';
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      }),
      shareReplay(1)
    );
  }
}
