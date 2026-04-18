import {Injectable} from '@angular/core';
import { Observable} from 'rxjs';
import {SubscriptionPlanApiService} from './subscription-plan-api.service';
import {SubscriptionPlan} from '../models/subscription-plan';
import {CreateSubscriptionPlanDto} from '../models/create-subscription-plan-dto';
import {UpdateSubscriptionPlanDto} from '../models/update-subscription-plan-dto';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {
  constructor(private apiService: SubscriptionPlanApiService) {
  }

  getAllPlans(): Observable<SubscriptionPlan[] | null> {
    return this.apiService.getSubscriptionPlans();
  }

  getOwnerPlans(): Observable<SubscriptionPlan[] | null> {
    return this.apiService.getOwnerSubscriptionPlans();
  }

  createPlan(request: CreateSubscriptionPlanDto): Observable<void> {
    return this.apiService.createSubscriptionPlan(request);
  }

  getPlanDetails(id: number): Observable<SubscriptionPlan | null> {
    return this.apiService.getSubscriptionPlan(id);
  }

  updatePlan(id: number, dto: UpdateSubscriptionPlanDto): Observable<void> {
    return this.apiService.updateSubscriptionPlan(id, dto);
  }

  deactivatePlan(id: number): Observable<void> {
    return this.apiService.deactivateSubscriptionPlan(id);
  }

  deletePlan(id: number): Observable<void> {
    return this.apiService.deleteSubscriptionPlan(id);
  }
}
