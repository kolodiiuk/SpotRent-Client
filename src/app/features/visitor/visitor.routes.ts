import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { SpaceDetailsComponent } from './space-details/space-details.component';
import { SpacesComponent } from './spaces/spaces.component'

export const VISITOR_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: "spaces", component: SpacesComponent },
  { path: 'spaces/:id', component: SpaceDetailsComponent }
];
