import {Routes} from '@angular/router';
import {AdminLayoutComponent} from './admin-layout.component';

export const ADMIN_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../features/admin/admin.routes')
            .then(m => m.ADMIN_ROUTES)
      }
    ]
  }
];
