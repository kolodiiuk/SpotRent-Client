import { Routes } from '@angular/router';
import { MyBookingsComponent } from '../../features/bookings/components/my-bookings/my-bookings.component';
import { BookingDetailsComponent } from '../../features/bookings/components/booking-details/booking-details.component';
import { ProfileComponent } from '../../features/user-profile/components/profile/profile.component';
import { MySubscriptionsComponent } from '../../features/subscriptions/components/my-subscriptions/my-subscriptions.component';
import { SubscriptionDetailsComponent } from '../../features/subscriptions/components/subscription-details/subscription-details.component';
import { SubscriptionChangeComponent } from '../../features/subscriptions/components/subscription-change/subscription-change.component';
import { SubscriptionHistoryComponent } from '../../features/subscriptions/components/subscription-history/subscription-history.component';
import { UserAccessLogsComponent } from '../../features/access-logs/components/user-access-logs.component';
import { AccessLogDetailsComponent } from '../../features/access-logs/components/access-log-details.component';
import { MyBookingHistoryComponent } from '../../features/bookings/components/my-booking-history/my-booking-history.component';

export const USER_ROUTES: Routes = [
  { path: '', component: MyBookingsComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'my-bookings/history', component: MyBookingHistoryComponent },
  { path: 'my-bookings/:id', component: BookingDetailsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'subscriptions/history', component: SubscriptionHistoryComponent },
  { path: 'subscriptions/:id/change', component: SubscriptionChangeComponent },
  { path: 'subscriptions/:id', component: SubscriptionDetailsComponent },
  { path: 'subscriptions', component: MySubscriptionsComponent },
  { path: 'access-logs', component: UserAccessLogsComponent },
  { path: 'access-logs/:id', component: AccessLogDetailsComponent },
];
