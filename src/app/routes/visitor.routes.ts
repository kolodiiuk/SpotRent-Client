import { Routes } from '@angular/router';
import { HomeComponent } from '../../features/visitor/home/home.component';
import { AboutComponent } from '../../features/visitor/about/about.component';
import { ContactComponent } from '../../features/visitor/contact/contact.component';
import { SpaceDetailsComponent } from '../../features/spaces/components/space-details/space-details.component';
import { SpacesComponent } from '../../features/spaces/components/spaces/spaces.component'
import { UserSubscriptionsComponent } from '../../features/subscriptions/components/user-subsrciptions/user-subscriptions.component';
import { SubscriptionPlanDetailsComponent } from '../../features/subscriptions/components/subscription-plan-details/subscription-plan-details.component';

export const VISITOR_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: "spaces", component: SpacesComponent },
  { path: 'spaces/:id', component: SpaceDetailsComponent },
  { path: 'subscription', redirectTo: 'subscription-plans', pathMatch: 'full' },
  { path: 'subscription/:id', redirectTo: 'subscription-plans/:id', pathMatch: 'full' },
  { path: 'subscription-plans', component: UserSubscriptionsComponent },
  { path: 'subscription-plans/:id', component: SubscriptionPlanDetailsComponent }
];
