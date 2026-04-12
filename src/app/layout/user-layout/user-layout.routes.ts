import { Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout.component';

export const USER_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [{
      path: '',
      loadChildren: () =>
        import('../../../features/user/user.routes')
          .then(m => m.USER_ROUTES)
    }]
  }
];
