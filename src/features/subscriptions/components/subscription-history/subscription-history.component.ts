import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { SubscriptionHistoryEntry } from '../../models/subscription-history-entry';
import { subscriptionStatusTokens, subscriptionStatusVariant } from '../../models/subscription-dto.model';
import {ErrorComponent} from '../../../../app/shared/components/error/error.component';
import {LoaderComponent} from '../../../../app/shared/components/loader.component';

@Component({
  selector: 'app-subscription-history',
  standalone: true,
  imports: [CommonModule, RouterModule, ErrorComponent, LoaderComponent],
  templateUrl: 'subscription-history.component.html'
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
