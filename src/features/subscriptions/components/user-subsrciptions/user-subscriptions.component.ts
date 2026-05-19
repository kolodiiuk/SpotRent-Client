
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscriptionPlan } from '../../../subscription-plans/models/subscription-plan';
import { durationLabels } from '../../../subscription-plans/models/duration-labels';
import { SubscriptionPlanService } from '../../../subscription-plans/services/subsription-plan.service';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [RouterModule],
  templateUrl: 'user-subscriptions.component.html',
  styleUrl: 'user-subscriptions.component.css'
})
export class UserSubscriptionsComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  isLoading = false;
  error = '';
  labels = durationLabels;

  constructor(private planService: SubscriptionPlanService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.isLoading = true;
    this.error = '';

    this.planService.getAllPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load subscription plans', err);
        this.error = 'Failed to load available subscription plans.';
        this.isLoading = false;
      }
    });
  }
}
