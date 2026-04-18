import { Routes } from '@angular/router';
import { AdminDashboardComponent } from '../../features/user-profile/components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from '../../features/user-profile/components/users/admin-users.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: AdminUsersComponent }
];
