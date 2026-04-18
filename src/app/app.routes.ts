import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./routes/visitor-layout.routes')
        .then(m => m.VISITOR_LAYOUT_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./routes/auth.routes')
        .then(m => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () =>
      import('./routes/admin-layout.routes')
        .then(m => m.ADMIN_LAYOUT_ROUTES),
  },
  {
    path: 'owner',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['OWNER', 'ADMIN'] },
    loadChildren: () =>
      import('./routes/owner-layout.routes')
        .then(m => m.OWNER_LAYOUT_ROUTES),
  },
  {
    path: 'user',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['USER', 'OWNER', 'ADMIN'] },
    loadChildren: () =>
      import('./routes/user-layout.routes')
        .then(m => m.USER_LAYOUT_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
