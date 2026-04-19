import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { SubscriptionWithPlan } from '../../models/subscription-view.model';
import {
  paymentStatusLabel,
  subscriptionStatusTokens,
  subscriptionStatusVariant
} from '../../models/subscription-dto.model';

@Component({
  selector: 'app-subscription-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <a routerLink="../" class="mb-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m0 0l7 7" />
        </svg>
        Back
      </a>

      <div *ngIf="error" class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ error }}</div>
      <div *ngIf="isLoading" class="flex justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>

      <div *ngIf="!isLoading && subscription" class="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-100 px-6 py-5">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Subscription details</p>
              <h1 class="mt-2 text-3xl font-bold text-gray-900">{{ subscription.plan.name }}</h1>
              <p class="mt-2 text-sm text-gray-600">{{ subscription.plan.description }}</p>
            </div>
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              [class.bg-emerald-100]="subscriptionStatusVariant(subscription.subscription.status) === 'success'"
              [class.text-emerald-700]="subscriptionStatusVariant(subscription.subscription.status) === 'success'"
              [class.bg-amber-100]="subscriptionStatusVariant(subscription.subscription.status) === 'warning'"
              [class.text-amber-700]="subscriptionStatusVariant(subscription.subscription.status) === 'warning'"
              [class.bg-red-100]="subscriptionStatusVariant(subscription.subscription.status) === 'danger'"
              [class.text-red-700]="subscriptionStatusVariant(subscription.subscription.status) === 'danger'"
              [class.bg-sky-100]="subscriptionStatusVariant(subscription.subscription.status) === 'info'"
              [class.text-sky-700]="subscriptionStatusVariant(subscription.subscription.status) === 'info'">
              {{ subscriptionStatusTokens(subscription.subscription.status).join(', ') }}
            </span>
          </div>
        </div>

        <div class="grid gap-4 p-6 md:grid-cols-3">
          <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p class="text-xs uppercase tracking-wide text-gray-500">Plan price</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">{{ subscription.plan.price }}</p>
          </div>
          <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p class="text-xs uppercase tracking-wide text-gray-500">Included hours</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">{{ subscription.plan.includedHours }}</p>
          </div>
          <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p class="text-xs uppercase tracking-wide text-gray-500">Payment</p>
            <p class="mt-2 text-2xl font-semibold text-gray-900">{{ paymentStatusLabel(subscription.subscription.paymentStatus) }}</p>
          </div>
        </div>

        <div class="grid gap-4 px-6 pb-6 md:grid-cols-2">
          <div class="rounded-xl border border-gray-100 p-4 text-sm text-gray-700">
            <p><span class="font-medium">Start date:</span> {{ subscription.subscription.startDate | date:'medium' }}</p>
            <p class="mt-2"><span class="font-medium">End date:</span> {{ subscription.subscription.endDate | date:'medium' }}</p>
            <p class="mt-2"><span class="font-medium">Hours used:</span> {{ subscription.subscription.hoursUsed }}</p>
          </div>
          <div class="rounded-xl border border-gray-100 p-4 text-sm text-gray-700">
            <p><span class="font-medium">Total amount:</span> {{ subscription.subscription.totalAmount }}</p>
            <p class="mt-2"><span class="font-medium">Subscription ID:</span> {{ subscription.subscription.id }}</p>
            <p class="mt-2"><span class="font-medium">Plan ID:</span> {{ subscription.subscription.subscriptionPlanId }}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 px-6 py-5">
          <a [routerLink]="['/user/subscriptions', subscription.subscription.id, 'change']" class="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700">
            Change plan
          </a>
          <a routerLink="/user/subscriptions" class="rounded-lg border border-gray-200 bg-white px-5 py-2 font-medium text-gray-700 hover:bg-gray-50">
            Back to list
          </a>
        </div>
      </div>
    </div>
  `
})
export class SubscriptionDetailsComponent implements OnInit {
  subscription: SubscriptionWithPlan | null = null;
  isLoading = false;
  error = '';
  readonly paymentStatusLabel = paymentStatusLabel;
  readonly subscriptionStatusTokens = subscriptionStatusTokens;
  readonly subscriptionStatusVariant = subscriptionStatusVariant;
  private subscriptionId = 0;

  constructor(
    private route: ActivatedRoute,
    private userSubscriptionService: UserSubscriptionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!id) {
        this.error = 'Invalid subscription id.';
        return;
      }

      this.subscriptionId = id;
      this.loadSubscription();
    });
  }

  loadSubscription(): void {
    this.isLoading = true;
    this.error = '';
    this.subscription = null;

    this.userSubscriptionService.getSubscriptionDetails(this.subscriptionId).subscribe({
      next: (subscription) => {
        this.subscription = subscription;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load subscription details', err);
        this.error = 'Failed to load subscription details.';
        this.isLoading = false;
      }
    });
  }
}
