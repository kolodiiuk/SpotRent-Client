import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubscriptionPlanService } from '../../../subscription-plans/services/subsription-plan.service';
import { SubscriptionPlan } from '../../../subscription-plans/models/subscription-plan';
import { Duration } from '../../../subscription-plans/models/duration';
import { LocalDatePipe } from '../../../../app/shared/pipes';

@Component({
  selector: 'owner-owner-user-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LocalDatePipe],
  templateUrl: 'owner-dashboard.component.html',
  styleUrl: 'owner-dashboard.component.css'
})
export class OwnerDashboardComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  isLoading = false;
  error = '';

  constructor(
    private planService: SubscriptionPlanService,
    private translate: TranslateService
  ) {}

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
        this.error = this.translate.instant('OWNER_DASHBOARD.ERROR_LOAD');
        this.isLoading = false;
      }
    });
  }

  getDurationKey(duration: Duration): string {
    switch (duration) {
      case Duration.Week:
        return 'SUBSCRIPTION_DURATION.WEEK';
      case Duration.TwoWeeks:
        return 'SUBSCRIPTION_DURATION.TWO_WEEKS';
      case Duration.Month:
        return 'SUBSCRIPTION_DURATION.MONTH';
      case Duration.ThreeMonths:
        return 'SUBSCRIPTION_DURATION.THREE_MONTHS';
      default:
        return 'SUBSCRIPTION_DURATION.UNKNOWN';
    }
  }
}
