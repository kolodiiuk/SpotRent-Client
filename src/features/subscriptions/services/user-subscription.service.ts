import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { SubscriptionService } from './subscription.service';
import { SubscriptionPlanService } from '../../subscription-plans/services/subsription-plan.service';
import { CreateSubscriptionRequest } from '../models/create-subscription-request';
import { SubscriptionCreationResponse } from '../models/subscription-creation-response';
import { Observable, forkJoin, map, of, switchMap, take, throwError } from 'rxjs';
import { SubscriptionWithPlan, SubscriptionHistoryWithPlan } from '../models/subscription-view.model';
import { SubscriptionDto } from '../models/subscription-dto.model';
import { SubscriptionHistoryEntry } from '../models/subscription-history-entry';
import { SubscriptionPlan } from '../../subscription-plans/models/subscription-plan';

@Injectable({
  providedIn: 'root'
})
export class UserSubscriptionService {
  constructor(
    private subscriptionService: SubscriptionService,
    private planService: SubscriptionPlanService,
    private authService: AuthService
  ) {}

  getMySubscriptions(): Observable<SubscriptionWithPlan[]> {
    return this.subscriptionService.getMySubscriptions().pipe(
      switchMap((subscriptions) => this.attachPlansToSubscriptions(subscriptions))
    );
  }

  getSubscriptionDetails(subscriptionId: number): Observable<SubscriptionWithPlan> {
    return this.subscriptionService.getSubscriptionById(subscriptionId).pipe(
      switchMap((subscription) => this.attachPlanToSubscription(subscription))
    );
  }

  getSubscriptionHistory(): Observable<SubscriptionHistoryEntry[]> {
    return this.subscriptionService.getSubscriptionHistory();
  }

  getSubscriptionHistoryWithPlans(): Observable<SubscriptionHistoryWithPlan[]> {
    return this.subscriptionService.getSubscriptionHistory().pipe(
      switchMap((entries) => {
        if (entries.length === 0) {
          return of([]);
        }

        return forkJoin(entries.map((entry) => this.planService.getPlanDetails(entry.subscriptionPlanId).pipe(
          map((plan) => ({ entry, plan }))
        )));
      })
    );
  }

  getAvailablePlans(): Observable<SubscriptionPlan[]> {
    return this.planService.getAllPlans().pipe(
      map((plans) => plans.filter((plan) => plan.isActive))
    );
  }

  createSubscriptionForPlan(planId: number): Observable<SubscriptionCreationResponse> {
    return this.authService.user$.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('User must be authenticated to subscribe.'));
        }

        const request: CreateSubscriptionRequest = {
          userId: user.id,
          planId
        };

        return this.subscriptionService.createSubscription(request);
      })
    );
  }

  changeSubscriptionPlan(subscriptionId: number, newPlanId: number): Observable<void> {
    return this.subscriptionService.changeSubscription(subscriptionId, newPlanId);
  }

  private attachPlansToSubscriptions(subscriptions: SubscriptionDto[]): Observable<SubscriptionWithPlan[]> {
    if (subscriptions.length === 0) {
      return of([]);
    }

    return forkJoin(subscriptions.map((subscription) => this.attachPlanToSubscription(subscription)));
  }

  private attachPlanToSubscription(subscription: SubscriptionDto): Observable<SubscriptionWithPlan> {
    return this.planService.getPlanDetails(subscription.subscriptionPlanId).pipe(
      map((plan) => ({ subscription, plan }))
    );
  }
}
