import { Routes } from '@angular/router';
import { VisitorLayoutComponent } from './visitor-layout.component';

export const VISITOR_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: VisitorLayoutComponent,
    children: [{
      path: '',
      loadChildren: () =>
        import('../../../features/visitor/visitor.routes')
          .then(m => m.VISITOR_ROUTES),
    }]
  }
];
