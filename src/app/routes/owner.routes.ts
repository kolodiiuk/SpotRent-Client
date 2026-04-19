import { Routes } from '@angular/router';
import { OwnerDashboardComponent } from '../../features/user-profile/components/owner-dashboard/owner-dashboard.component';
import { OwnerSpacesComponent } from '../../features/spaces/components/owner-spaces.component';
import { OwnerBookingsComponent } from '../../features/bookings/components/owner-bookings/owner-bookings.component';
import { OwnerSmartLocksComponent } from '../../features/smart-locks/components/owner-smart-locks.component';
import { OwnerAccessLogsComponent } from '../../features/access-logs/components/owner-access-logs.component';
import { OwnerSubscriptionsComponent } from '../../features/subscriptions/components/owner-subscriptions/owner-subscriptions.component';
import { OwnerSpaceFormComponent } from '../../features/spaces/components/owner-space-form/owner-space-form.component';

export const OWNER_ROUTES: Routes = [
  { path: '', component: OwnerDashboardComponent },
  { path: 'spaces', component: OwnerSpacesComponent },
  { path: 'spaces/new', component: OwnerSpaceFormComponent },
  { path: 'spaces/:id/edit', component: OwnerSpaceFormComponent },
  { path: 'bookings', component: OwnerBookingsComponent },
  { path: 'smart-locks', component: OwnerSmartLocksComponent },
  { path: 'access-logs', component: OwnerAccessLogsComponent },
  { path: 'subscription-plans', component: OwnerSubscriptionsComponent },
  { path: 'subscription-plans/new', loadComponent: () => import('../../features/subscriptions/components/subscription-form/subscription-plan-form.component').then(c => c.SubscriptionPlanForm) },
  { path: 'subscription-plans/:id/edit', loadComponent: () => import('../../features/subscriptions/components/subscription-form/subscription-plan-form.component').then(c => c.SubscriptionPlanForm) },
  { path: 'subscriptions/new', redirectTo: 'subscription-plans/new', pathMatch: 'full' },
  { path: 'subscriptions/:id/edit', redirectTo: 'subscription-plans/:id/edit', pathMatch: 'full' },
  { path: 'subscriptions', redirectTo: 'subscription-plans', pathMatch: 'full' }
];
