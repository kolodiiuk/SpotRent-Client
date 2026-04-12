import { Routes } from '@angular/router';
import { UserDashboardComponent } from './dashboard/user-dashboard.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { ProfileComponent } from './profile/profile.component';
import { UserSubscriptionsComponent } from './subscriptions/user-subscriptions.component';

export const USER_ROUTES: Routes = [
  { path: '', component: UserDashboardComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'subscriptions', component: UserSubscriptionsComponent }
];
