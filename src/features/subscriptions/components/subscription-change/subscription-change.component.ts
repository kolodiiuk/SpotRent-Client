import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubscriptionPlan } from '../../../subscription-plans/models/subscription-plan';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { SubscriptionWithPlan } from '../../models/subscription-view.model';
import {ErrorComponent} from '../../../../app/shared/components/error/error.component';
import {LoaderComponent} from '../../../../app/shared/components/loader.component';

@Component({
  selector: 'app-subscription-change',
  standalone: true,
  imports: [CommonModule, RouterModule, ErrorComponent, LoaderComponent],
  templateUrl: 'subscription-change.component.html'
})
export class SubscriptionChangeComponent implements OnInit {
  subscription: SubscriptionWithPlan | null = null;
  plans: SubscriptionPlan[] = [];
  selectedPlanId: number | null = null;
  currentPlanId: number | null = null;
  subscriptionId = 0;
  loading = false;
  isSaving = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subscriptionFacade: UserSubscriptionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this.error = 'Invalid subscription id.';
        return;
      }

      this.subscriptionId = id;
      this.loadData();
    });
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    this.message = '';
    this.subscription = null;

    this.subscriptionFacade.getSubscriptionDetails(this.subscriptionId).subscribe({
      next: (subscription) => {
        this.subscription = subscription;
        this.currentPlanId = subscription.subscription.subscriptionPlanId;
        this.selectedPlanId = null;

        this.subscriptionFacade.getAvailablePlans().subscribe({
          next: (plans) => {
            this.plans = plans.filter((plan) => plan.id !== subscription.subscription.subscriptionPlanId);
            this.loading = false;
          },
          error: (err) => {
            console.error('Failed to load plans', err);
            this.error = 'Failed to load available plans.';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Failed to load subscription', err);
        this.error = 'Failed to load subscription details.';
        this.loading = false;
      }
    });
  }

  selectPlan(planId: number): void {
    this.selectedPlanId = planId;
  }

  changePlan(): void {
    if (!this.selectedPlanId || this.selectedPlanId === this.currentPlanId) {
      return;
    }

    this.isSaving = true;
    this.error = '';

    this.subscriptionFacade.changeSubscriptionPlan(this.subscriptionId, this.selectedPlanId).subscribe({
      next: () => {
        this.isSaving = false;
        this.message = 'Subscription plan changed successfully.';
        this.router.navigate(['/user/subscriptions', this.subscriptionId]);
      },
      error: (err) => {
        console.error('Failed to change subscription plan', err);
        this.error = 'Failed to change subscription plan.';
        this.isSaving = false;
      }
    });
  }
}
