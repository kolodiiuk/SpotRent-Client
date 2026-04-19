import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {
  SubscriptionDto
} from '../models/subscription-dto.model';
import {Observable} from 'rxjs';
import {SubscriptionHistoryEntry} from '../models/subscription-history-entry';
import {SubscriptionCreationResponse} from '../models/subscription-creation-response';
import {CreateSubscriptionRequest} from '../models/create-subscription-request';

@Injectable({
    providedIn: "root"
  }
)
export class SubscriptionService {
  private url = `${environment.serverApiUrl}/subscription`;
  private readonly http = inject(HttpClient);

  createSubscription(request: CreateSubscriptionRequest) : Observable<SubscriptionCreationResponse> {
    return this.http.post<SubscriptionCreationResponse>(this.url, request);
  }

  getSubscriptionById(id: number) : Observable<SubscriptionDto> {
    return this.http.get<SubscriptionDto>(`${this.url}/${id}`);
  }

  getSubscriptionHistory() : Observable<SubscriptionHistoryEntry[]> {
    return this.http.get<SubscriptionHistoryEntry[]>(`${this.url}/history`);
  }

  getMySubscriptions() : Observable<SubscriptionDto[]> {
    return this.http.get<SubscriptionDto[]>(`${this.url}/me`);
  }

  changeSubscription(subscriptionId: number, newPlanId: number) : Observable<void> {
    return this.http.patch<void>(`${this.url}/${subscriptionId}/change`, newPlanId);
  }
}
