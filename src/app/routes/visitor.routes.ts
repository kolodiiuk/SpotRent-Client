import { Routes } from '@angular/router';
import { HomeComponent } from '../../features/visitor/home/home.component';
import { AboutComponent } from '../../features/visitor/about/about.component';
import { ContactComponent } from '../../features/visitor/contact/contact.component';
import { SpaceDetailsComponent } from '../../features/spaces/components/space-details/space-details.component';
import { SpacesComponent } from '../../features/spaces/components/spaces/spaces.component'

export const VISITOR_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: "spaces", component: SpacesComponent },
  { path: 'spaces/:id', component: SpaceDetailsComponent }
];
