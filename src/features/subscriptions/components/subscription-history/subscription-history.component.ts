import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { SubscriptionHistoryEntry } from '../../models/subscription-history-entry';
import { subscriptionStatusTokens, subscriptionStatusVariant } from '../../models/subscription-dto.model';
import {ErrorComponent} from '../../../../app/shared/components/error/error.component';
import {LoaderComponent} from '../../../../app/shared/components/loader.component';
import { LocalDatePipe } from '../../../../app/shared/pipes';
import { catchError, finalize, Observable, of, shareReplay } from 'rxjs';

@Component({
  selector: 'app-subscription-history',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ErrorComponent, LoaderComponent, LocalDatePipe],
  templateUrl: 'subscription-history.component.html'
})
export class SubscriptionHistoryComponent implements OnInit {
  history$!: Observable<SubscriptionHistoryEntry[]>;
  isLoading = false;
  error = '';
  readonly subscriptionStatusTokens = subscriptionStatusTokens;
  readonly subscriptionStatusVariant = subscriptionStatusVariant;

  constructor(
    private userSubscriptionService: UserSubscriptionService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.error = '';

    this.history$ = this.userSubscriptionService.getSubscriptionHistory().pipe(
      catchError((err) => {
        console.error('Failed to load subscription history', err);
        this.error = err?.error ?? this.translate.instant('USER_SUBSCRIPTIONS.ERROR_HISTORY');
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      }),
      shareReplay(1)
    );
  }

  getSubscriptionStatusKeys(status: number): string[] {
    return this.subscriptionStatusTokens(status).map(token => `SUBSCRIPTION_STATUS.${token.toUpperCase().replace(/ /g, '_')}`);
  }
}
