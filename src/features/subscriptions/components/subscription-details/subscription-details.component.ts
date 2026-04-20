import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { SubscriptionWithPlan } from '../../models/subscription-view.model';
import {
  paymentStatusLabel,
  subscriptionStatusTokens,
  subscriptionStatusVariant
} from '../../models/subscription-dto.model';
import { ErrorComponent } from "../../../../app/shared/components/error/error.component";
import { LoaderComponent } from "../../../../app/shared/components/loader.component";

@Component({
  selector: 'app-subscription-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ErrorComponent, LoaderComponent],
  templateUrl: 'subscription-details.component.html'
})
export class SubscriptionDetailsComponent implements OnInit {
  subscription: SubscriptionWithPlan | null = null;
  isLoading = false;
  error = '';
  readonly paymentStatusLabel = paymentStatusLabel;
  readonly subscriptionStatusTokens = subscriptionStatusTokens;
  readonly subscriptionStatusVariant = subscriptionStatusVariant;
  private subscriptionId = 0;

  constructor(
    private route: ActivatedRoute,
    private userSubscriptionService: UserSubscriptionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this.error = 'Invalid subscription id.';
        return;
      }

      this.subscriptionId = id;
      this.loadSubscription();
    });
  }

  loadSubscription(): void {
    this.isLoading = true;
    this.error = '';
    this.subscription = null;

    this.userSubscriptionService.getSubscriptionDetails(this.subscriptionId).subscribe({
      next: (subscription) => {
        this.subscription = subscription;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load subscription details', err);
        this.error = 'Failed to load subscription details.';
        this.isLoading = false;
      }
    });
  }
}
