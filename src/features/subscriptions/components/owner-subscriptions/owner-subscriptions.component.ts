import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SubscriptionPlanService } from '../../../subscription-plans/services/subsription-plan.service';
import { durationLabels } from '../../../subscription-plans/models/duration-labels';
import { SubscriptionPlan } from '../../../subscription-plans/models/subscription-plan';

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
  error = '';
  actionMessage = '';
  labels = durationLabels;

  constructor(
    private planService: SubscriptionPlanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.isLoading = true;
    this.error = '';
    this.planService.getOwnerPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching plans', err);
        this.error = 'Failed to load subscription plans.';
        this.isLoading = false;
      }
    });
  }

  openEdit(planId: number) {
    this.router.navigate(['/owner/subscription-plans', planId, 'edit']);
  }

  createPlan() {
    this.router.navigate(['/owner/subscription-plans/new']);
  }

  deactivate(planId: number, event: Event) {
    event.stopPropagation();
    const confirmed = confirm('Deactivate this subscription plan?');
    if (!confirmed) {
      return;
    }

    this.planService.deactivatePlan(planId).subscribe({
      next: () => {
        this.actionMessage = 'Subscription plan deactivated.';
        this.loadPlans();
      },
      error: (err) => {
        console.error('Failed to deactivate plan', err);
        this.error = 'Failed to deactivate subscription plan.';
      }
    });
  }

  deletePlan(planId: number, event: Event) {
    event.stopPropagation();
    const confirmed = confirm('Delete this subscription plan permanently?');
    if (!confirmed) {
      return;
    }

    this.planService.deletePlan(planId).subscribe({
      next: () => {
        this.actionMessage = 'Subscription plan deleted.';
        this.loadPlans();
      },
      error: (err) => {
        console.error('Failed to delete plan', err);
        this.error = 'Failed to delete subscription plan.';
      }
    });
  }
}
