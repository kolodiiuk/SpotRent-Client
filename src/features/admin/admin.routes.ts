import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './users/admin-users.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: AdminUsersComponent }
];
