import { Routes } from '@angular/router';
import { OwnerLayoutComponent } from '../layout/owner-layout/owner-layout.component';

export const OWNER_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: OwnerLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./owner.routes')
            .then(m => m.OWNER_ROUTES)
      }
    ]
  }];
