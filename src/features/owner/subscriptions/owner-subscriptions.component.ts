import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubscriptionPlanService } from '../../../app/core/services/subscription-plan.service';
import { SubscriptionPlan, durationLabels } from '../../../app/core/models/subscription-plan.model';

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

  constructor(private planService: SubscriptionPlanService) {}

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
