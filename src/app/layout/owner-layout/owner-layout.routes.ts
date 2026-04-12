import { Routes } from '@angular/router';
import { OwnerLayoutComponent } from './owner-layout.component';

export const OWNER_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: OwnerLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../../features/owner/owner.routes')
            .then(m => m.OWNER_ROUTES)
      }
    ]
  }];
