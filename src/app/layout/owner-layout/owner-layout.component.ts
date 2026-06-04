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
    { label: 'Bookings', labelKey: 'ADMIN.BOOKINGS', icon: faCalendarDays, path: '/owner/bookings', exact: true },
    { label: 'Booking History', labelKey: 'NAV.BOOKING_HISTORY', icon: faClockRotateLeft, path: '/owner/bookings/history', exact: true },
    { label: 'Spaces', labelKey: 'NAV.SPACES', icon: faBuilding, path: '/owner/spaces' },
    { label: 'Subscription Plans', labelKey: 'NAV.SUBSCRIPTION', icon: faCreditCard, path: '/owner/subscription-plans' },
    { label: 'Access Logs', labelKey: 'ADMIN.ACCESS_LOGS', icon: faClipboardList, path: '/owner/access-logs' },
  ];
}
