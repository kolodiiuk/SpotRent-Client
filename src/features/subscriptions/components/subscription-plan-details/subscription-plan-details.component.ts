
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubscriptionPlan } from '../../../subscription-plans/models/subscription-plan';
import { durationLabels } from '../../../subscription-plans/models/duration-labels';
import { SubscriptionPlanService } from '../../../subscription-plans/services/subsription-plan.service';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-subscription-plan-details',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <a routerLink=".." class="mb-6 inline-flex items-center gap-2 font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m0 0l7 7" />
        </svg>
        Back to plans
      </a>
    
      @if (error) {
        <div class="mb-6 rounded-lg border border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20 p-4 text-sm text-danger-700 dark:text-danger-300">
          {{ error }}
        </div>
      }
    
      @if (isLoading) {
        <div class="flex justify-center p-12">
          <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
        </div>
      }
    
      @if (!isLoading && plan) {
        <div class="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/85 dark:bg-neutral-900/85 shadow-md backdrop-blur-sm">
          <div class="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-6 py-5">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Subscription plan details</p>
            <h1 class="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{{ plan.name }}</h1>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-neutral-700 dark:text-neutral-300">{{ plan.description }}</p>
          </div>
          <div class="grid gap-6 p-6 md:grid-cols-3">
            <div class="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-4">
              <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Price</p>
              <p class="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{{ plan.price }}</p>
            </div>
            <div class="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-4">
              <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Duration</p>
              <p class="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{{ labels[plan.duration] }}</p>
            </div>
            <div class="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-4">
              <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Included hours</p>
              <p class="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{{ plan.includedHours }}</p>
            </div>
          </div>
          <div class="grid gap-4 px-6 pb-6 md:grid-cols-2">
            <div class="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
              <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Owner</p>
              <p class="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {{ plan.ownerId !== null ? 'Owner #' + plan.ownerId : 'Owner unavailable' }}
              </p>
            </div>
            <div class="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
              <p class="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Status</p>
              <p class="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ plan.isActive ? 'Active' : 'Inactive' }}</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-700 px-6 py-5">
            <button type="button" routerLink=".." class="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-5 py-2 font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Back
            </button>
            <button type="button" (click)="subscribe()" [disabled]="isSubmitting || !plan?.isActive" class="rounded-lg bg-primary-600 px-5 py-2 font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
              @if (isSubmitting) {
                <span class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              }
              {{ plan?.isActive ? 'Subscribe' : 'Plan unavailable' }}
            </button>
          </div>
        </div>
      }
    </div>
    `
})
export class SubscriptionPlanDetailsComponent implements OnInit {
  plan: SubscriptionPlan | null = null;
  isLoading = false;
  isSubmitting = false;
  error = '';
  labels = durationLabels;
  private planId = 0;

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
        this.error = 'Invalid subscription plan id.';
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

    this.planService.getPlanDetails(this.planId).subscribe({
      next: (plan) => {
        this.plan = plan;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load subscription plan details', err);
        this.error = 'Failed to load subscription plan details.';
        this.isLoading = false;
      }
    });
  }

  subscribe(): void {
    if (!this.planId) {
      return;
    }

    if (!this.plan?.isActive) {
      this.error = 'This plan is not active anymore.';
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
        this.error = 'Failed to create subscription.';
        this.isSubmitting = false;
      }
    });
  }
}
