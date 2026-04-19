import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubscriptionPlan } from '../../../subscription-plans/models/subscription-plan';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { SubscriptionWithPlan } from '../../models/subscription-view.model';

@Component({
  selector: 'app-subscription-change',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <a [routerLink]="['/user/subscriptions', subscriptionId]" class="mb-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m0 0l7 7" />
        </svg>
        Back to subscription
      </a>

      <div *ngIf="error" class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ error }}</div>
      <div *ngIf="message" class="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{{ message }}</div>

      <div *ngIf="loading" class="flex justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>

      <div *ngIf="!loading && subscription" class="grid gap-6 lg:grid-cols-12">
        <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-5">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Current subscription</p>
          <h1 class="mt-2 text-2xl font-bold text-gray-900">{{ subscription.plan.name }}</h1>
          <p class="mt-3 text-sm text-gray-600">{{ subscription.plan.description }}</p>
          <div class="mt-5 space-y-2 text-sm text-gray-700">
            <p><span class="font-medium">Start date:</span> {{ subscription.subscription.startDate | date:'mediumDate' }}</p>
            <p><span class="font-medium">End date:</span> {{ subscription.subscription.endDate | date:'mediumDate' }}</p>
            <p><span class="font-medium">Hours used:</span> {{ subscription.subscription.hoursUsed }}</p>
          </div>
        </section>

        <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Available plans</p>
              <h2 class="mt-2 text-xl font-bold text-gray-900">Choose a replacement plan</h2>
            </div>
            <span class="text-sm text-gray-500">{{ plans.length }} plans</span>
          </div>

          <div class="mt-5 space-y-3">
            <button
              *ngFor="let plan of plans"
              type="button"
              (click)="selectPlan(plan.id)"
              class="w-full rounded-xl border px-4 py-4 text-left transition-all"
              [class.border-blue-500]="selectedPlanId === plan.id"
              [class.bg-blue-50]="selectedPlanId === plan.id"
              [class.border-emerald-500]="currentPlanId === plan.id"
              [class.border-gray-200]="selectedPlanId !== plan.id && currentPlanId !== plan.id">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="font-semibold text-gray-900">{{ plan.name }}</p>
                  <p class="mt-1 text-sm text-gray-600">{{ plan.description }}</p>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ plan.price }}</span>
              </div>
              <div class="mt-3 text-xs text-gray-500">
                <span class="mr-3">{{ plan.includedHours }} hours</span>
                <span>{{ plan.isActive ? 'Active' : 'Inactive' }}</span>
                <span *ngIf="currentPlanId === plan.id" class="ml-3 font-medium text-emerald-700">Current plan</span>
              </div>
            </button>
          </div>

          <div class="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
            <a routerLink="/user/subscriptions" class="rounded-lg border border-gray-200 bg-white px-5 py-2 font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </a>
            <button
              type="button"
              (click)="changePlan()"
              [disabled]="!selectedPlanId || selectedPlanId === currentPlanId || isSaving"
              class="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              <span *ngIf="isSaving" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Change plan
            </button>
          </div>
        </section>
      </div>
    </div>
  `
})
export class SubscriptionChangeComponent implements OnInit {
  subscription: SubscriptionWithPlan | null = null;
  plans: SubscriptionPlan[] = [];
  selectedPlanId: number | null = null;
  currentPlanId: number | null = null;
  subscriptionId = 0;
  loading = false;
  isSaving = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subscriptionFacade: UserSubscriptionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this.error = 'Invalid subscription id.';
        return;
      }

      this.subscriptionId = id;
      this.loadData();
    });
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    this.message = '';
    this.subscription = null;

    this.subscriptionFacade.getSubscriptionDetails(this.subscriptionId).subscribe({
      next: (subscription) => {
        this.subscription = subscription;
        this.currentPlanId = subscription.subscription.subscriptionPlanId;
        this.selectedPlanId = null;

        this.subscriptionFacade.getAvailablePlans().subscribe({
          next: (plans) => {
            this.plans = plans.filter((plan) => plan.id !== subscription.subscription.subscriptionPlanId);
            this.loading = false;
          },
          error: (err) => {
            console.error('Failed to load plans', err);
            this.error = 'Failed to load available plans.';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Failed to load subscription', err);
        this.error = 'Failed to load subscription details.';
        this.loading = false;
      }
    });
  }

  selectPlan(planId: number): void {
    this.selectedPlanId = planId;
  }

  changePlan(): void {
    if (!this.selectedPlanId || this.selectedPlanId === this.currentPlanId) {
      return;
    }

    this.isSaving = true;
    this.error = '';

    this.subscriptionFacade.changeSubscriptionPlan(this.subscriptionId, this.selectedPlanId).subscribe({
      next: () => {
        this.isSaving = false;
        this.message = 'Subscription plan changed successfully.';
        this.router.navigate(['/user/subscriptions', this.subscriptionId]);
      },
      error: (err) => {
        console.error('Failed to change subscription plan', err);
        this.error = 'Failed to change subscription plan.';
        this.isSaving = false;
      }
    });
  }
}
