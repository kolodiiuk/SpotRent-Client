import { Routes } from '@angular/router';
import { OwnerDashboardComponent } from './dashboard/owner-dashboard.component';
import { OwnerSpacesComponent } from './spaces/owner-spaces.component';
import { OwnerBookingsComponent } from './bookings/owner-bookings.component';
import { OwnerSmartLocksComponent } from './smart-locks/owner-smart-locks.component';
import { OwnerAccessLogsComponent } from './access-logs/owner-access-logs.component';
import { OwnerSubscriptionsComponent } from './subscriptions/owner-subscriptions.component';
import { OwnerSpaceFormComponent } from './spaces/space-form/owner-space-form.component';

export const OWNER_ROUTES: Routes = [
  { path: '', component: OwnerDashboardComponent },
  { path: 'spaces', component: OwnerSpacesComponent },
  { path: 'spaces/new', component: OwnerSpaceFormComponent },
  { path: 'spaces/:id/edit', component: OwnerSpaceFormComponent },
  { path: 'bookings', component: OwnerBookingsComponent },
  { path: 'smart-locks', component: OwnerSmartLocksComponent },
  { path: 'access-logs', component: OwnerAccessLogsComponent },
  { path: 'subscriptions', component: OwnerSubscriptionsComponent },
  { path: 'subscriptions/new', loadComponent: () => import('./subscriptions/subscription-form/subscription-form.component').then(c => c.SubscriptionFormComponent) },
  { path: 'subscriptions/:id/edit', loadComponent: () => import('./subscriptions/subscription-form/subscription-form.component').then(c => c.SubscriptionFormComponent) }
];
