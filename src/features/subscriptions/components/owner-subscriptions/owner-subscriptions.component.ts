import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubscriptionPlanApiService } from '../../../subscription-plans/services/subscription-plan-api.service';
import {durationLabels} from '../../../subscription-plans/models/duration-labels';
import {SubscriptionPlan} from '../../../subscription-plans/models/subscription-plan';

@Component({
  selector: 'owner-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'owner-subscriptions.component.html',
  styleUrl: 'owner-subscriptions.component.css'
})
export class OwnerSubscriptionsComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  isLoading = false;
  labels = durationLabels;

  constructor(private planService: SubscriptionPlanApiService) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.isLoading = true;
    this.planService.getSubscriptionPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching plans', err);
        this.isLoading = false;
      }
    });
  }

  deactivate(id: number) {
    if (confirm('Are you sure you want to deactivate this plan?')) {
      this.planService.deactivateSubscriptionPlan(id).subscribe(() => this.loadPlans());
    }
  }

  deletePlan(id: number) {
    if (confirm('Are you sure you want to permanently delete this plan?')) {
      this.planService.deleteSubscriptionPlan(id).subscribe(() => this.loadPlans());
    }
  }
}
