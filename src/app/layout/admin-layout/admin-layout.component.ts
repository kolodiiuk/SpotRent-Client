import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter } from 'rxjs/operators';
import { User } from '../../models';
import { ThemeService } from '../../services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { LocaleSwitcherComponent } from '../../shared/components/locale-switcher/locale-switcher.component';

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, AsyncPipe, TranslateModule, LocaleSwitcherComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  @Input() user!: User;
  @Output() logout = new EventEmitter<void>();

  sidebarCollapsed = false;
  profileMenuOpen = false;
  currentPath = '';

  navigationSections: NavigationSection[] = [
    {
      title: 'Overview',
      items: [
        { path: '/admin/owner-user-admin-dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
      ],
    },
    {
      title: 'Management',
      items: [
        { path: '/admin/spaces', label: 'Spaces & Rooms', icon: '🏢' },
        { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
        { path: '/admin/subscriptions', label: 'Subscriptions', icon: '💳' },
      ],
    },
    {
      title: 'Access & Security',
      items: [
        { path: '/admin/access-logs', label: 'Access Logs', icon: '🔐' },
        { path: '/admin/smart-locks', label: 'Smart Locks', icon: '🔒' },
      ],
    },
    {
      title: 'Financial',
      items: [
        { path: '/admin/payments', label: 'Payments', icon: '💰' },
        { path: '/admin/reports', label: 'Reports', icon: '📄' },
        { path: '/admin/invoices', label: 'Invoices', icon: '🧾' },
      ],
    },
    {
      title: 'System',
      items: [
        { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
        { path: '/admin/logs', label: 'System Logs', icon: '📋' },
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
