import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { SubscriptionWithPlan } from '../../models/subscription-view.model';
import {
  paymentStatusLabel,
  paymentStatusVariant,
  subscriptionStatusTokens,
  subscriptionStatusVariant
} from '../../models/subscription-dto.model';

@Component({
  selector: 'app-my-subscriptions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">My Subscriptions</h1>
          <p class="mt-2 text-sm text-gray-600">Manage the subscriptions you currently own.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a routerLink="/subscription-plans" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Browse plans</a>
          <a routerLink="/user/subscriptions/history" class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">History</a>
        </div>
      </div>

      <div *ngIf="error" class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ error }}</div>
      <div *ngIf="isLoading" class="flex justify-center py-10">
        <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>

      <div *ngIf="!isLoading && subscriptions.length === 0" class="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900">No subscriptions yet</h2>
        <p class="mt-2 text-sm text-gray-500">Choose a plan from the public catalog to create one.</p>
        <div class="mt-6">
          <a routerLink="/subscription-plans" class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            View plans
          </a>
        </div>
      </div>

      <div *ngIf="!isLoading && subscriptions.length > 0" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article *ngFor="let item of subscriptions" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ item.plan.name }}</h2>
              <p class="mt-1 text-sm text-gray-600">{{ item.plan.description }}</p>
            </div>
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              [class.bg-emerald-100]="subscriptionStatusVariant(item.subscription.status) === 'success'"
              [class.text-emerald-700]="subscriptionStatusVariant(item.subscription.status) === 'success'"
              [class.bg-amber-100]="subscriptionStatusVariant(item.subscription.status) === 'warning'"
              [class.text-amber-700]="subscriptionStatusVariant(item.subscription.status) === 'warning'"
              [class.bg-red-100]="subscriptionStatusVariant(item.subscription.status) === 'danger'"
              [class.text-red-700]="subscriptionStatusVariant(item.subscription.status) === 'danger'"
              [class.bg-sky-100]="subscriptionStatusVariant(item.subscription.status) === 'info'"
              [class.text-sky-700]="subscriptionStatusVariant(item.subscription.status) === 'info'">
              {{ subscriptionStatusTokens(item.subscription.status).join(', ') }}
            </span>
          </div>

          <div class="mt-5 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
            <p><span class="font-medium">Price:</span> {{ item.plan.price }}</p>
            <p><span class="font-medium">Included hours:</span> {{ item.plan.includedHours }}</p>
            <p><span class="font-medium">Start:</span> {{ item.subscription.startDate | date:'mediumDate' }}</p>
            <p><span class="font-medium">End:</span> {{ item.subscription.endDate | date:'mediumDate' }}</p>
            <p><span class="font-medium">Payment:</span> {{ paymentStatusLabel(item.subscription.paymentStatus) }}</p>
            <p><span class="font-medium">Hours used:</span> {{ item.subscription.hoursUsed }}</p>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <a [routerLink]="['/user/subscriptions', item.subscription.id]" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">View details</a>
            <a [routerLink]="['/user/subscriptions', item.subscription.id, 'change']" class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Change plan</a>
          </div>
        </article>
      </div>
    </div>
  `
})
export class MySubscriptionsComponent implements OnInit {
  subscriptions: SubscriptionWithPlan[] = [];
  isLoading = false;
  error = '';

  readonly subscriptionStatusTokens = subscriptionStatusTokens;
  readonly subscriptionStatusVariant = subscriptionStatusVariant;
  readonly paymentStatusLabel = paymentStatusLabel;
  readonly paymentStatusVariant = paymentStatusVariant;

  constructor(private userSubscriptionService: UserSubscriptionService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.isLoading = true;
    this.error = '';

    this.userSubscriptionService.getMySubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load subscriptions', err);
        this.error = 'Failed to load your subscriptions.';
        this.isLoading = false;
      }
    });
  }
}
