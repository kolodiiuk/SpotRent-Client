import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent, NavigationItem } from '../../shared/components/layout/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/layout/header/header.component';
import {
  faBuilding,
  faCalendarDays,
  faClockRotateLeft,
  faClipboardList,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'owner-layout',
  standalone: true,
  imports: [RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: 'owner-layout.component.html',
  styleUrl: 'owner-layout.component.css'
})
export class OwnerLayoutComponent {
  ownerNavItems: NavigationItem[] = [
    { label: 'Bookings', icon: faCalendarDays, path: '/owner/bookings', exact: true },
    { label: 'Booking History', icon: faClockRotateLeft, path: '/owner/bookings/history', exact: true },
    { label: 'Spaces', icon: faBuilding, path: '/owner/spaces' },
    { label: 'Subscription Plans', icon: faCreditCard, path: '/owner/subscription-plans' },
    { label: 'Access Logs', icon: faClipboardList, path: '/owner/access-logs' },
  ];
}
