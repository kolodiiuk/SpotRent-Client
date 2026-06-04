import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter } from 'rxjs/operators';
import { User } from '../../models';
import { ThemeService } from '../../services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { LocaleSwitcherComponent } from '../../shared/components/locale-switcher/locale-switcher.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faCalendarDays,
  faClockRotateLeft,
  faMoon,
  faSun,
  faWallet,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface NavigationItem {
  path: string;
  label: string;
  labelKey: string;
  icon: IconDefinition;
}

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterModule, RouterOutlet, AsyncPipe, TranslateModule, LocaleSwitcherComponent, FontAwesomeModule],
  templateUrl: 'user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {
  readonly faBars = faBars;
  readonly faXmark = faXmark;
  readonly faMoon = faMoon;
  readonly faSun = faSun;

  @Input() user!: User;
  @Output() logout = new EventEmitter<void>();

  sidebarOpen = false;
  profileMenuOpen = false;
  currentPath = '';

  navigationItems: NavigationItem[] = [
    { path: '/user/my-bookings', label: 'My Bookings', labelKey: 'NAV.MY_BOOKINGS', icon: faCalendarDays },
    { path: '/user/my-bookings/history', label: 'Booking History', labelKey: 'NAV.BOOKING_HISTORY', icon: faClockRotateLeft },
    { path: '/user/subscriptions', label: 'My Subscriptions', labelKey: 'NAV.MY_SUBSCRIPTIONS', icon: faWallet },
    { path: '/user/subscriptions/history', label: 'Subscription History', labelKey: 'NAV.SUBSCRIPTION_HISTORY', icon: faClockRotateLeft }
  ];

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.currentPath = this.router.url;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.urlAfterRedirects;
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  isActive(path: string): boolean {
    return this.currentPath === path;
  }

  onLogout(): void {
    this.closeProfileMenu();
    this.logout.emit();
  }

  navigateToBooking(): void {
    this.router.navigate(['/subscription-plans']);
  }

  getUserInitial(): string {
    return this.user?.firstName?.charAt(0).toUpperCase() || 'U';
  }
}
