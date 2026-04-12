import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SubscriptionPlan, CreateSubscriptionPlanRequest, UpdateSubscriptionPlanRequest } from '../models/subscription-plan.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {
  private apiUrl = '/api/SubscriptionPlans';

  constructor(private http: HttpClient) {}

  getSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(this.apiUrl);
  }

  getSubscriptionPlan(id: number): Observable<SubscriptionPlan> {
    return this.http.get<SubscriptionPlan>(`${this.apiUrl}/${id}`);
  }

  createSubscriptionPlan(request: CreateSubscriptionPlanRequest): Observable<SubscriptionPlan> {
    return this.http.post<SubscriptionPlan>(this.apiUrl, request);
  }

  updateSubscriptionPlan(id: number, request: UpdateSubscriptionPlanRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, request);
  }

  deactivateSubscriptionPlan(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/deactivate`, {});
  }

  deleteSubscriptionPlan(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
