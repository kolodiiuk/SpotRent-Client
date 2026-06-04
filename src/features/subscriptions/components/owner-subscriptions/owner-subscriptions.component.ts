import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {SubscriptionPlanService} from '../../../subscription-plans/services/subsription-plan.service';
import {SubscriptionPlan} from '../../../subscription-plans/models/subscription-plan';
import {ErrorComponent} from '../../../../app/shared/components/error/error.component';
import {LoaderComponent} from '../../../../app/shared/components/loader.component';
import {catchError, Observable, of, tap} from 'rxjs';
import { Duration } from '../../../subscription-plans/models/duration';

@Component({
  selector: 'owner-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ErrorComponent, LoaderComponent],
  templateUrl: 'owner-subscriptions.component.html',
  styleUrl: 'owner-subscriptions.component.css',
})
export class OwnerSubscriptionsComponent implements OnInit {
  plans$!: Observable<SubscriptionPlan[]>;
  isLoading = false;
  error = '';
  actionMessage = '';
  private planService = inject(SubscriptionPlanService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.isLoading = true;
    this.error = '';
    this.actionMessage = '';

    this.plans$ = this.planService.getOwnerPlans().pipe(
      tap(() => this.isLoading = false),
      catchError(err => {
        this.isLoading = false;
        this.error = this.translate.instant('OWNER_SUBSCRIPTIONS.ERROR_LOAD');
        return of([]);
      })
    );
  }

  openEdit(planId: number) {
    this.router.navigate(['/owner/subscription-plans', planId, 'edit']);
  }

  createPlan() {
    this.router.navigate(['/owner/subscription-plans/new']);
  }

  deactivate(planId: number, event: Event) {
    event.stopPropagation();
    const confirmed = confirm(this.translate.instant('OWNER_SUBSCRIPTIONS.CONFIRM_DEACTIVATE'));
    if (!confirmed) {
      return;
    }

    this.planService.deactivatePlan(planId).subscribe({
      next: () => {
        this.actionMessage = this.translate.instant('OWNER_SUBSCRIPTIONS.DEACTIVATED');
        this.loadPlans();
      },
      error: (err) => {
        console.error('Failed to deactivate plan', err);
        this.error = this.translate.instant('OWNER_SUBSCRIPTIONS.ERROR_DEACTIVATE');
      }
    });
  }

  activate(planId: number, event: Event) {
    event.stopPropagation();
    const confirmed = confirm(this.translate.instant('OWNER_SUBSCRIPTIONS.CONFIRM_ACTIVATE'));
    if (!confirmed) {
      return;
    }

    this.planService.activatePlan(planId).subscribe({
      next: () => {
        this.actionMessage = this.translate.instant('OWNER_SUBSCRIPTIONS.ACTIVATED');
        this.loadPlans();
      },
      error: (err) => {
        console.error('Failed to activate plan', err);
        this.error = this.translate.instant('OWNER_SUBSCRIPTIONS.ERROR_ACTIVATE');
      }
    });
  }

  deletePlan(planId: number, event: Event) {
    event.stopPropagation();
    const confirmed = confirm(this.translate.instant('OWNER_SUBSCRIPTIONS.CONFIRM_DELETE'));
    if (!confirmed) {
      return;
    }

    this.planService.deletePlan(planId).subscribe({
      next: () => {
        this.actionMessage = this.translate.instant('OWNER_SUBSCRIPTIONS.DELETED');
        this.loadPlans();
      },
      error: (err) => {
        console.error('Failed to delete plan', err);
        this.error = this.translate.instant('OWNER_SUBSCRIPTIONS.ERROR_DELETE');
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
