import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SubscriptionPlan} from '../../../subscription-plans/models/subscription-plan';
import {SubscriptionPlanService} from '../../../subscription-plans/services/subsription-plan.service';
import {catchError, finalize, Observable, of} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {Duration} from '../../../subscription-plans/models/duration';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [RouterModule, AsyncPipe, TranslateModule],
  templateUrl: 'visitor-subscription-plans.component.html',
  styleUrl: 'visitor-subscription-plans.component.css'
})
export class VisitorSubscriptionPlansComponent implements OnInit {
  isLoading = false;
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
  plans$!: Observable<SubscriptionPlan[]>;

  constructor(private planService: SubscriptionPlanService) {
  }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.isLoading = true;
    this.error = '';

    this.plans$ = this.planService.getAllPlans().pipe(
      catchError(err => {
        this.error = 'VISITOR_SUBSCRIPTION_PLANS.ERROR_LOAD';
        this.isLoading = false;

        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      }));
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
