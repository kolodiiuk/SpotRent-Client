import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { SubscriptionHistoryEntry } from '../../models/subscription-history-entry';
import { subscriptionStatusTokens, subscriptionStatusVariant } from '../../models/subscription-dto.model';

@Component({
  selector: 'app-subscription-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">Subscription History</h1>
          <p class="mt-2 text-sm text-gray-600">Every subscription you have used, cancelled, or renewed.</p>
        </div>
        <a routerLink="/user/subscriptions" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          My subscriptions
        </a>
      </div>

      <div *ngIf="error" class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ error }}</div>
      <div *ngIf="isLoading" class="flex justify-center py-10">
        <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>

      <div *ngIf="!isLoading && history.length === 0" class="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900">No history yet</h2>
        <p class="mt-2 text-sm text-gray-500">Historical subscription activity will appear here once you have previous plans.</p>
      </div>

      <div *ngIf="!isLoading && history.length > 0" class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Plan</th>
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Active</th>
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Started</th>
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Expires</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let item of history" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <p class="font-semibold text-gray-900">{{ item.subscriptionPlanName }}</p>
                <p class="text-xs text-gray-500">Plan ID: {{ item.subscriptionPlanId }}</p>
              </td>
              <td class="px-6 py-4">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  [class.bg-emerald-100]="subscriptionStatusVariant(item.subscriptionStatus) === 'success'"
                  [class.text-emerald-700]="subscriptionStatusVariant(item.subscriptionStatus) === 'success'"
                  [class.bg-amber-100]="subscriptionStatusVariant(item.subscriptionStatus) === 'warning'"
                  [class.text-amber-700]="subscriptionStatusVariant(item.subscriptionStatus) === 'warning'"
                  [class.bg-red-100]="subscriptionStatusVariant(item.subscriptionStatus) === 'danger'"
                  [class.text-red-700]="subscriptionStatusVariant(item.subscriptionStatus) === 'danger'"
                  [class.bg-sky-100]="subscriptionStatusVariant(item.subscriptionStatus) === 'info'"
                  [class.text-sky-700]="subscriptionStatusVariant(item.subscriptionStatus) === 'info'">
                  {{ subscriptionStatusTokens(item.subscriptionStatus).join(', ') }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ item.isActive ? 'Yes' : 'No' }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ item.startedAt | date:'mediumDate' }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ item.expiresAt | date:'mediumDate' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SubscriptionHistoryComponent implements OnInit {
  history: SubscriptionHistoryEntry[] = [];
  isLoading = false;
  error = '';
  readonly subscriptionStatusTokens = subscriptionStatusTokens;
  readonly subscriptionStatusVariant = subscriptionStatusVariant;

  constructor(private userSubscriptionService: UserSubscriptionService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.error = '';

    this.userSubscriptionService.getSubscriptionHistory().subscribe({
      next: (history) => {
        this.history = history;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load subscription history', err);
        this.error = 'Failed to load subscription history.';
        this.isLoading = false;
      }
    });
  }
}
