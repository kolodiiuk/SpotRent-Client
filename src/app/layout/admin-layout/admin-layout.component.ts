import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter } from 'rxjs/operators';
import { User } from '../../models';
import { ThemeService } from '../../services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { LocaleSwitcherComponent } from '../../shared/components/locale-switcher/locale-switcher.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faBell,
  faBuilding,
  faCalendarDays,
  faChartColumn,
  faChartLine,
  faCreditCard,
  faFileInvoice,
  faFileLines,
  faGear,
  faLock,
  faMagnifyingGlass,
  faMoon,
  faReceipt,
  faShieldHalved,
  faSun,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface NavigationItem {
  path: string;
  label: string;
  icon: IconDefinition;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, AsyncPipe, TranslateModule, LocaleSwitcherComponent, FontAwesomeModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  readonly faArrowLeft = faArrowLeft;
  readonly faArrowRight = faArrowRight;
  readonly faMagnifyingGlass = faMagnifyingGlass;
  readonly faBell = faBell;
  readonly faMoon = faMoon;
  readonly faSun = faSun;

  @Input() user!: User;
  @Output() logout = new EventEmitter<void>();

  sidebarCollapsed = false;
  profileMenuOpen = false;
  currentPath = '';

  navigationSections: NavigationSection[] = [
    {
      title: 'Overview',
      items: [
        { path: '/admin/owner-user-admin-dashboard', label: 'Dashboard', icon: faChartColumn },
        { path: '/admin/analytics', label: 'Analytics', icon: faChartLine },
      ],
    },
    {
      title: 'Management',
      items: [
        { path: '/admin/spaces', label: 'Spaces & Rooms', icon: faBuilding },
        { path: '/admin/bookings', label: 'Bookings', icon: faCalendarDays },
        { path: '/admin/users', label: 'Users', icon: faUsers },
        { path: '/admin/subscriptions', label: 'Subscriptions', icon: faCreditCard },
      ],
    },
    {
      title: 'Access & Security',
      items: [
        { path: '/admin/access-logs', label: 'Access Logs', icon: faShieldHalved },
        { path: '/admin/smart-locks', label: 'Smart Locks', icon: faLock },
      ],
    },
    {
      title: 'Financial',
      items: [
        { path: '/admin/payments', label: 'Payments', icon: faCreditCard },
        { path: '/admin/reports', label: 'Reports', icon: faFileLines },
        { path: '/admin/invoices', label: 'Invoices', icon: faFileInvoice },
      ],
    },
    {
      title: 'System',
      items: [
        { path: '/admin/settings', label: 'Settings', icon: faGear },
        { path: '/admin/logs', label: 'System Logs', icon: faReceipt },
      ],
    },
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
    this.sidebarCollapsed = !this.sidebarCollapsed;
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

  getUserInitial(): string {
    return this.user?.firstName?.charAt(0).toUpperCase() || 'A';
  }
}
