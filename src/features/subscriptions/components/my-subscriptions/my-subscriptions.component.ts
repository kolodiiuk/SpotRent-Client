import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {UserSubscriptionService} from '../../services/user-subscription.service';
import {SubscriptionWithPlan} from '../../models/subscription-view.model';
import {
  paymentStatusLabel,
  paymentStatusVariant,
  subscriptionStatusTokens,
  subscriptionStatusVariant
} from '../../models/subscription-dto.model';
import {tap} from 'rxjs';
import {ErrorComponent} from '../../../../app/shared/components/error/error.component';
import {LoaderComponent} from '../../../../app/shared/components/loader.component';

@Component({
  selector: 'app-my-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterModule, ErrorComponent, LoaderComponent],
  templateUrl: 'my-subscriptions.component.html'
})
export class MySubscriptionsComponent implements OnInit {
  subscriptions: SubscriptionWithPlan[] = [];
  isLoading = false;
  error = '';

  readonly subscriptionStatusTokens = subscriptionStatusTokens;
  readonly subscriptionStatusVariant = subscriptionStatusVariant;
  readonly paymentStatusLabel = paymentStatusLabel;
  readonly paymentStatusVariant = paymentStatusVariant;

  constructor(private userSubscriptionService: UserSubscriptionService) {
  }

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.isLoading = true;
    this.error = '';

    this.userSubscriptionService.getMySubscriptions().pipe(tap(_ => alert("from hell"))).subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load subscriptions', err);
        this.error = 'Failed to load your subscriptions.';
        this.isLoading = false;
      }
    });
  }
}
