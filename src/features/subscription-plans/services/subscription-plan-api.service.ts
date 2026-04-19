import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateSubscriptionPlanDto} from '../models/create-subscription-plan-dto';
import {UpdateSubscriptionPlanDto} from '../models/update-subscription-plan-dto';
import {SubscriptionPlan} from '../models/subscription-plan';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanApiService {
  private apiUrl = `${environment.serverApiUrl}/subscription-plans`;

  constructor(private http: HttpClient) {
  }

  getSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(this.apiUrl);
  }

  getOwnerSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    const url = `${this.apiUrl}/owner`;
    return this.http.get<SubscriptionPlan[]>(url);
  }

  getSubscriptionPlan(id: number): Observable<SubscriptionPlan> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<SubscriptionPlan>(url);
  }

  createSubscriptionPlan(request: CreateSubscriptionPlanDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, request);
  }

  updateSubscriptionPlan(id: number, request: UpdateSubscriptionPlanDto): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<void>(url, request);
  }

  deactivateSubscriptionPlan(id: number): Observable<void> {
    const url = `${this.apiUrl}/deactivate/${id}`;
    return this.http.put<void>(url, {});
  }

  deleteSubscriptionPlan(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
