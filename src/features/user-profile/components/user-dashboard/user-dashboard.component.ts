import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserSubscriptionService } from '../../../subscriptions/services/user-subscription.service';
import { SubscriptionWithPlan } from '../../../subscriptions/models/subscription-view.model';
import {
  paymentStatusLabel,
  paymentStatusVariant,
  subscriptionStatusTokens,
  subscriptionStatusVariant
} from '../../../subscriptions/models/subscription-dto.model';

@Component({
  selector: 'user-owner-user-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'user-dashboard.component.html',
  styleUrl: 'user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  subscriptions: SubscriptionWithPlan[] = [];
  isLoading = false;
  error = '';

  readonly subscriptionStatusTokens = subscriptionStatusTokens;
  readonly subscriptionStatusVariant = subscriptionStatusVariant;
  readonly paymentStatusLabel = paymentStatusLabel;
  readonly paymentStatusVariant = paymentStatusVariant;

  constructor(private subscriptionFacade: UserSubscriptionService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.isLoading = true;
    this.error = '';

    this.subscriptionFacade.getMySubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user subscriptions', err);
        this.error = 'Failed to load your subscriptions.';
        this.isLoading = false;
      }
    });
  }
}
