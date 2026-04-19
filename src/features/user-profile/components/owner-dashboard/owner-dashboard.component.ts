import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscriptionPlanService } from '../../../subscription-plans/services/subsription-plan.service';
import { SubscriptionPlan } from '../../../subscription-plans/models/subscription-plan';
import { durationLabels } from '../../../subscription-plans/models/duration-labels';

@Component({
  selector: 'owner-owner-user-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'owner-dashboard.component.html',
  styleUrl: 'owner-dashboard.component.css'
})
export class OwnerDashboardComponent implements OnInit {
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

    this.planService.getOwnerPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load owner subscription plans', err);
        this.error = 'Failed to load your subscription plans.';
        this.isLoading = false;
      }
    });
  }
}
