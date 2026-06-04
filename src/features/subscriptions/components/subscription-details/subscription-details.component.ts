import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { SubscriptionWithPlan } from '../../models/subscription-view.model';
import {
  paymentStatusLabel,
  subscriptionStatusTokens,
  subscriptionStatusVariant
} from '../../models/subscription-dto.model';
import { ErrorComponent } from "../../../../app/shared/components/error/error.component";
import { LoaderComponent } from "../../../../app/shared/components/loader.component";
import { LocalDatePipe, LocalTimePipe } from '../../../../app/shared/pipes';

@Component({
  selector: 'app-subscription-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ErrorComponent, LoaderComponent, LocalDatePipe, LocalTimePipe],
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
    private userSubscriptionService: UserSubscriptionService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this.error = this.translate.instant('USER_SUBSCRIPTIONS.ERROR_INVALID_ID');
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
        this.error = this.translate.instant('USER_SUBSCRIPTIONS.ERROR_DETAILS');
        this.isLoading = false;
      }
    });
  }

  getSubscriptionStatusKeys(status: number): string[] {
    return this.subscriptionStatusTokens(status).map(token => `SUBSCRIPTION_STATUS.${token.toUpperCase().replace(/ /g, '_')}`);
  }

  getPaymentStatusKey(status: number): string {
    return `PAYMENT_STATUS.${this.paymentStatusLabel(status).toUpperCase().replace(/ /g, '_')}`;
  }
}
