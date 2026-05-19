import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubscriptionPlan } from '../../models/subscription-plan';
import { SubscriptionPlanService } from '../../services/subsription-plan.service';
import { UserSubscriptionService } from '../../../subscriptions/services/user-subscription.service';
import { AuthService } from '../../../auth/services/auth.service';
import {catchError, finalize, Observable, of} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {Duration} from '../../models/duration';

@Component({
  selector: 'app-subscription-plan-details',
  standalone: true,
  imports: [RouterModule, AsyncPipe, TranslateModule],
  templateUrl: './subscription-plan-details.component.html'
})
export class SubscriptionPlanDetailsComponent implements OnInit {
  plan: SubscriptionPlan | null = null;
  isLoading = false;
  isSubmitting = false;
  error = '';
  durationLabelKeys: Record<Duration, string> = {
    [Duration.Week]: 'SUBSCRIPTION_DURATION.WEEK',
    [Duration.TwoWeeks]: 'SUBSCRIPTION_DURATION.TWO_WEEKS',
    [Duration.Month]: 'SUBSCRIPTION_DURATION.MONTH',
    [Duration.ThreeMonths]: 'SUBSCRIPTION_DURATION.THREE_MONTHS',
  };
  private durationLabelKeysByName: Record<string, string> = {
    Week: 'SUBSCRIPTION_DURATION.WEEK',
    TwoWeeks: 'SUBSCRIPTION_DURATION.TWO_WEEKS',
    Month: 'SUBSCRIPTION_DURATION.MONTH',
    ThreeMonths: 'SUBSCRIPTION_DURATION.THREE_MONTHS',
  };
  private planId = 0;
  plan$!: Observable<null | SubscriptionPlan>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: SubscriptionPlanService,
    private subscriptionFacade: UserSubscriptionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this.error = 'SUBSCRIPTION_PLAN_DETAILS.ERROR_INVALID_ID';
        return;
      }

      this.planId = id;
      this.loadPlan();
    });
  }

  loadPlan(): void {
    this.isLoading = true;
    this.error = '';
    this.plan = null;

    this.plan$ = this.planService.getPlanDetails(this.planId).pipe(
      catchError(err => {
        this.error = 'SUBSCRIPTION_PLAN_DETAILS.ERROR_LOAD';
        this.isLoading = false;
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  subscribe(): void {
    if (!this.planId) {
      return;
    }

    if (!this.plan?.isActive) {
      this.error = 'SUBSCRIPTION_PLAN_DETAILS.ERROR_INACTIVE';
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { state: { returnUrl: `/subscription-plans/${this.planId}` } });
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    this.subscriptionFacade.createSubscriptionForPlan(this.planId).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.router.navigate(['/user/subscriptions', response.subscriptionId]);
      },
      error: (err) => {
        console.error('Failed to create subscription', err);
        this.error = 'SUBSCRIPTION_PLAN_DETAILS.ERROR_SUBSCRIBE';
        this.isSubmitting = false;
      }
    });
  }

  getDurationLabelKey(duration: Duration | string | number | null | undefined): string {
    if (typeof duration === 'number') {
      return this.durationLabelKeys[duration as Duration] ?? 'SUBSCRIPTION_DURATION.UNKNOWN';
    }

    if (typeof duration === 'string') {
      if (this.durationLabelKeysByName[duration]) {
        return this.durationLabelKeysByName[duration];
      }

      const parsed = Number(duration);
      if (Number.isInteger(parsed)) {
        return this.durationLabelKeys[parsed as Duration] ?? 'SUBSCRIPTION_DURATION.UNKNOWN';
      }
    }

    return 'SUBSCRIPTION_DURATION.UNKNOWN';
  }
}
