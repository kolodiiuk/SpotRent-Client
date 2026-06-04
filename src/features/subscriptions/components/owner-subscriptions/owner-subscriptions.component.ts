import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {SubscriptionPlanService} from '../../../subscription-plans/services/subsription-plan.service';
import {durationLabels} from '../../../subscription-plans/models/duration-labels';
import {SubscriptionPlan} from '../../../subscription-plans/models/subscription-plan';
import {ErrorComponent} from '../../../../app/shared/components/error/error.component';
import {LoaderComponent} from '../../../../app/shared/components/loader.component';
import {catchError, Observable, of, tap} from 'rxjs';

@Component({
  selector: 'owner-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterModule, ErrorComponent, LoaderComponent],
  templateUrl: 'owner-subscriptions.component.html',
  styleUrl: 'owner-subscriptions.component.css',
})
export class OwnerSubscriptionsComponent implements OnInit {
  plans$!: Observable<SubscriptionPlan[]>;
  isLoading = false;
  error = '';
  actionMessage = '';
  labels = durationLabels;
  private planService = inject(SubscriptionPlanService);
  private router = inject(Router);

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
        this.error = 'Failed to load subscription plans.';
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

  activate(planId: number, event: Event) {
    event.stopPropagation();
    const confirmed = confirm('Activate this subscription plan?');
    if (!confirmed) {
      return;
    }

    this.planService.activatePlan(planId).subscribe({
      next: () => {
        this.actionMessage = 'Subscription plan activated.';
        this.loadPlans();
      },
      error: (err) => {
        console.error('Failed to activate plan', err);
        this.error = 'Failed to activate subscription plan.';
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
