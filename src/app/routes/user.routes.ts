import { Routes } from '@angular/router';
import { UserDashboardComponent } from '../../features/user-profile/components/user-dashboard/user-dashboard.component';
import { MyBookingsComponent } from '../../features/bookings/components/my-bookings/my-bookings.component';
import { ProfileComponent } from '../../features/user-profile/components/profile/profile.component';
import { MySubscriptionsComponent } from '../../features/subscriptions/components/my-subscriptions/my-subscriptions.component';
import { SubscriptionDetailsComponent } from '../../features/subscriptions/components/subscription-details/subscription-details.component';
import { SubscriptionChangeComponent } from '../../features/subscriptions/components/subscription-change/subscription-change.component';
import { SubscriptionHistoryComponent } from '../../features/subscriptions/components/subscription-history/subscription-history.component';

export const USER_ROUTES: Routes = [
  { path: '', component: UserDashboardComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'subscriptions/history', component: SubscriptionHistoryComponent },
  { path: 'subscriptions/:id/change', component: SubscriptionChangeComponent },
  { path: 'subscriptions/:id', component: SubscriptionDetailsComponent },
  { path: 'subscriptions', component: MySubscriptionsComponent },
];
