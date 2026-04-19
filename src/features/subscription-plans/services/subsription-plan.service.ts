import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionPlanApiService } from './subscription-plan-api.service';
import { SubscriptionPlan } from '../models/subscription-plan';
import { CreateSubscriptionPlanDto } from '../models/create-subscription-plan-dto';
import { UpdateSubscriptionPlanDto } from '../models/update-subscription-plan-dto';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {
  constructor(private apiService: SubscriptionPlanApiService) {}

  getAllPlans(): Observable<SubscriptionPlan[]> {
    return this.apiService.getSubscriptionPlans();
  }

  getOwnerPlans(): Observable<SubscriptionPlan[]> {
    return this.apiService.getOwnerSubscriptionPlans();
  }

  getPlanDetails(id: number): Observable<SubscriptionPlan> {
    return this.apiService.getSubscriptionPlan(id);
  }

  createPlan(request: CreateSubscriptionPlanDto): Observable<void> {
    return this.apiService.createSubscriptionPlan(request);
  }

  updatePlan(id: number, request: UpdateSubscriptionPlanDto): Observable<void> {
    return this.apiService.updateSubscriptionPlan(id, request);
  }

  deactivatePlan(id: number): Observable<void> {
    return this.apiService.deactivateSubscriptionPlan(id);
  }

  deletePlan(id: number): Observable<void> {
    return this.apiService.deleteSubscriptionPlan(id);
  }
}
