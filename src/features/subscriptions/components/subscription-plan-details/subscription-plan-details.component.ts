import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <a routerLink=".." class="mb-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m0 0l7 7" />
        </svg>
        Back to plans
      </a>

      <div *ngIf="error" class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ error }}
      </div>

      <div *ngIf="isLoading" class="flex justify-center p-12">
        <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>

      <div *ngIf="!isLoading && plan" class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Subscription plan details</p>
          <h1 class="mt-2 text-3xl font-bold text-gray-900">{{ plan.name }}</h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-700">{{ plan.description }}</p>
        </div>

        <div class="grid gap-6 p-6 md:grid-cols-3">

          <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p class="text-xs uppercase tracking-wide text-gray-500">Price</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">{{ plan.price }}</p>
          </div>
          <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p class="text-xs uppercase tracking-wide text-gray-500">Duration</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">{{ labels[plan.duration] }}</p>
          </div>
          <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p class="text-xs uppercase tracking-wide text-gray-500">Included hours</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">{{ plan.includedHours }}</p>
          </div>
        </div>

        <div class="grid gap-4 px-6 pb-6 md:grid-cols-2">
          <div class="rounded-xl border border-gray-100 p-4">
            <p class="text-xs uppercase tracking-wide text-gray-500">Owner</p>
            <p class="mt-2 text-lg font-semibold text-gray-900">
              {{ plan.ownerId !== null ? 'Owner #' + plan.ownerId : 'Owner unavailable' }}
            </p>
          </div>
          <div class="rounded-xl border border-gray-100 p-4">
            <p class="text-xs uppercase tracking-wide text-gray-500">Status</p>
            <p class="mt-2 text-lg font-semibold text-gray-900">{{ plan.isActive ? 'Active' : 'Inactive' }}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 px-6 py-5">
          <button type="button" routerLink=".." class="rounded-lg border border-gray-200 bg-white px-5 py-2 font-medium text-gray-700 hover:bg-gray-50">
            Back
          </button>
          <button type="button" (click)="subscribe()" [disabled]="isSubmitting || !plan?.isActive" class="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            <span *ngIf="isSubmitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ plan?.isActive ? 'Subscribe' : 'Plan unavailable' }}
          </button>
        </div>
      </div>
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
