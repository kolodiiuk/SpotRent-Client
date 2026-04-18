import { Routes } from '@angular/router';
import { UserDashboardComponent } from '../../features/user-profile/components/user-dashboard/user-dashboard.component';
import { MyBookingsComponent } from '../../features/bookings/components/my-bookings/my-bookings.component';
import { ProfileComponent } from '../../features/user-profile/components/profile/profile.component';
import { UserSubscriptionsComponent } from '../../features/subscriptions/components/user-subsrciptions/user-subscriptions.component';

export const USER_ROUTES: Routes = [
  { path: '', component: UserDashboardComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'subscriptions', component: UserSubscriptionsComponent }
];
